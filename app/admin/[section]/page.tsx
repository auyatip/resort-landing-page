import { redirect } from "next/navigation";

const sections = new Set(["bookings", "analytics", "visitors"]);

export default function AdminSectionPage({ params }: { params: { section: string } }) {
  const section = sections.has(params.section) ? params.section : "overview";
  redirect(`/admin?section=${section}`);
}
