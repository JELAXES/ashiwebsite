import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The conversation history page was renamed to "Notebook". Keep old
      // links (bookmarks, the previous nav route) working.
      { source: "/history", destination: "/notebook", permanent: true },
    ];
  },
};

export default nextConfig;
