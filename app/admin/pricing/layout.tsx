import AdminShell from "../../components/AdminShell";

export default function PricingAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell active="pricing">{children}</AdminShell>;
}
