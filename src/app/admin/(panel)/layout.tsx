import { requireSession } from "@/lib/auth";
import { Sidebar } from "@/components/admin/sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  return (
    <div className="admin">
      <Sidebar email={session.email} />
      <main>{children}</main>
    </div>
  );
}
