import Link from "next/link";

const dashboardNavItems = [
  { href: "/dashboard/messages", label: "Messages" },
  { href: "/dashboard/appointments", label: "Appointments" },
  { href: "/dashboard/medical-records", label: "Medical Records" },
  { href: "/dashboard/profile", label: "Profile" },
];

export function DashboardNav() {
  return (
    <nav className="bg-primary">
      <div className="container mx-auto px-6 py-2">
        <div className="gapx-4 flex flex-wrap justify-center">
          {dashboardNavItems.map((item, index) => (
            <Link href={item.href} key={index}>
              <div className="rounded-md px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-green-600">
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
