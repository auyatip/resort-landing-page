import AdminNavigation from "../../components/AdminNavigation";

export default function RoomAdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-subpage-shell mx-auto min-h-screen w-full max-w-7xl bg-[#f4f0e7] p-4 lg:grid lg:grid-cols-[208px_1fr] lg:gap-6 lg:p-6"><aside className="p-0"><AdminNavigation active="rooms" /></aside><div className="min-w-0">{children}</div></div>;
}
