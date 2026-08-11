import { Fragment } from "react";
import { cn } from "@/lib/utils";

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
  });
}

interface Block {
  type: "heading" | "bullet-list" | "number-list" | "paragraph";
  lines: string[];
}

function parseBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", lines: [line.slice(3)] });
      continue;
    }

    if (/^[-•]\s+/.test(line)) {
      const text = line.replace(/^[-•]\s+/, "");
      const last = blocks[blocks.length - 1];
      if (last?.type === "bullet-list") {
        last.lines.push(text);
      } else {
        blocks.push({ type: "bullet-list", lines: [text] });
      }
      continue;
    }

    if (/^\d+[.)]\s+/.test(line)) {
      const text = line.replace(/^\d+[.)]\s+/, "");
      const last = blocks[blocks.length - 1];
      if (last?.type === "number-list") {
        last.lines.push(text);
      } else {
        blocks.push({ type: "number-list", lines: [text] });
      }
      continue;
    }

    const last = blocks[blocks.length - 1];
    if (last?.type === "paragraph") {
      last.lines.push(line);
    } else {
      blocks.push({ type: "paragraph", lines: [line] });
    }
  }

  return blocks;
}

interface MarkdownLiteProps {
  content: string;
  className?: string;
}

/** Tiny, dependency-free renderer for a safe markdown subset: headings, bold, bullet & numbered lists. */
export function MarkdownLite({ content, className }: MarkdownLiteProps) {
  const blocks = parseBlocks(content);

  return (
    <div className={cn("space-y-3 text-sm leading-relaxed text-foreground/90", className)}>
      {blocks.map((block, bi) => {
        const key = `block-${bi}`;
        switch (block.type) {
          case "heading":
            return (
              <h4 key={key} className="font-heading text-sm font-semibold tracking-wide text-foreground uppercase">
                {renderInline(block.lines[0], key)}
              </h4>
            );
          case "bullet-list":
            return (
              <ul key={key} className="list-disc space-y-1.5 pl-5 marker:text-primary">
                {block.lines.map((l, li) => (
                  <li key={`${key}-${li}`}>{renderInline(l, `${key}-${li}`)}</li>
                ))}
              </ul>
            );
          case "number-list":
            return (
              <ol key={key} className="list-decimal space-y-1.5 pl-5 marker:font-semibold marker:text-primary">
                {block.lines.map((l, li) => (
                  <li key={`${key}-${li}`}>{renderInline(l, `${key}-${li}`)}</li>
                ))}
              </ol>
            );
          default:
            return (
              <p key={key}>
                {block.lines.map((l, li) => (
                  <Fragment key={`${key}-${li}`}>
                    {li > 0 && " "}
                    {renderInline(l, `${key}-${li}`)}
                  </Fragment>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}
