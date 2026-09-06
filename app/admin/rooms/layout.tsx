import AdminShell from "../../components/AdminShell";

export default function RoomAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell active="rooms">{children}</AdminShell>;
}
