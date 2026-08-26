import { PageShell } from "../../components";
import { LoginForm } from "./form";

export const metadata = { title: "Admin sign in" };

export default function AdminLoginPage() {
  return <PageShell>
    <section className="admin-shell">
      <h1 className="admin-title">Admin sign in.</h1>
      <p className="admin-intro">Enter the admin password to manage articles, events and enquiries.</p>
      <LoginForm />
    </section>
  </PageShell>;
}
