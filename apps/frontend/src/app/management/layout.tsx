import ManagementNav from "@components/ManagementNav";

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ManagementNav />
      <main className="p-6">{children}</main>
    </div>
  );
}