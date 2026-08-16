import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin login",
};

export default function AdminLoginPage() {
  return (
    <AuthShell title="Admin" subtitle="Enter the admin password to continue.">
      <AdminLoginForm />
    </AuthShell>
  );
}
