import Link from "next/link";
import { usePathname } from "next/navigation";

interface INavLinkProps {
  href: string;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  label: string;
}

export default function NavLink({
  href,
  activeIcon,
  inactiveIcon,
  label,
}: INavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className="flex flex-col items-center gap-1">
      {isActive ? activeIcon : inactiveIcon}
      <span className="text-xs">{label}</span>
    </Link>
  );
}
