import AdminShell from "../../components/AdminShell";

export default function BookingAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell active="bookings">{children}</AdminShell>;
}
