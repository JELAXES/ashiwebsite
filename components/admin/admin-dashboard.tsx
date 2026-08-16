"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  lawLevel: string | null;
  subjects: string[];
  onboarded: boolean;
  createdAt: string | null;
}

interface AdminConversation {
  id: string;
  title: string;
  subject: string;
  messageCount: number;
  userName: string;
  userEmail: string;
  createdAt: string | null;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  async function loadData() {
    setLoading(true);
    const [usersRes, conversationsRes] = await Promise.all([
      fetch("/api/admin/users"),
      fetch("/api/admin/conversations"),
    ]);
    if (usersRes.ok) setUsers((await usersRes.json()).users);
    if (conversationsRes.ok) setConversations((await conversationsRes.json()).conversations);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDeleteUser(id: string) {
    if (!confirm("Delete this user and all their conversations? This can't be undone.")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      await loadData();
    }
    setDeletingId(null);
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);

    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.error || "Something went wrong.");
        return;
      }
      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setPwError("Network error. Please try again.");
    } finally {
      setPwLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">All users and conversations in the database.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleLogout}>
          <LogOut className="size-3.5" aria-hidden="true" />
          Log out
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Loading records...
        </div>
      ) : (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="py-2 pr-4 font-medium">Name</th>
                      <th className="py-2 pr-4 font-medium">Email</th>
                      <th className="py-2 pr-4 font-medium">Law level</th>
                      <th className="py-2 pr-4 font-medium">Onboarded</th>
                      <th className="py-2 pr-4 font-medium">Created</th>
                      <th className="py-2 pr-4 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border/60 last:border-0">
                        <td className="py-2 pr-4 text-foreground">{u.name}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{u.email}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{u.lawLevel ?? "—"}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{u.onboarded ? "Yes" : "No"}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{formatDate(u.createdAt)}</td>
                        <td className="py-2 pr-4 text-right">
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            disabled={deletingId === u.id}
                            onClick={() => handleDeleteUser(u.id)}
                            aria-label={`Delete ${u.email}`}
                          >
                            {deletingId === u.id ? (
                              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                            ) : (
                              <Trash2 className="size-3.5" aria-hidden="true" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-muted-foreground">
                          No users yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversations ({conversations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="py-2 pr-4 font-medium">Title</th>
                      <th className="py-2 pr-4 font-medium">User</th>
                      <th className="py-2 pr-4 font-medium">Subject</th>
                      <th className="py-2 pr-4 font-medium">Messages</th>
                      <th className="py-2 pr-4 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversations.map((c) => (
                      <tr key={c.id} className="border-b border-border/60 last:border-0">
                        <td className="py-2 pr-4 text-foreground">{c.title}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{c.userEmail}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{c.subject}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{c.messageCount}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{formatDate(c.createdAt)}</td>
                      </tr>
                    ))}
                    {conversations.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-muted-foreground">
                          No conversations yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change admin password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="grid max-w-sm gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="new-password">New password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                {pwError && (
                  <p className="text-xs font-medium text-destructive" role="alert">
                    {pwError}
                  </p>
                )}
                {pwSuccess && <p className="text-xs font-medium text-emerald-600">Password updated.</p>}
                <Button type="submit" className="w-fit gap-2" disabled={pwLoading}>
                  {pwLoading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                  Update password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
