import { LoginForm } from "@/components/admin/login-form";
import { Wordmark } from "@/components/site/mark";

export default function LoginPage() {
  return (
    <main className="login-wrap">
      <div style={{ padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Wordmark />
        <p className="display" style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", maxWidth: "8ch" }}>
          Are you ready?
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
