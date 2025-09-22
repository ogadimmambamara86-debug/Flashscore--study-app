import ManagementSidebar from "@components/ManagementSidebar";

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <ManagementSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}