'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconShield, IconPlusCircle, IconList } from './Icons';

const links = [
  { href: '/', label: 'Generate', icon: IconPlusCircle },
  { href: '/records', label: 'Records', icon: IconList },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="topnav">
      <div className="topnav-inner">
        <span className="brand">
          <span className="brand-mark">
            <IconShield size={18} />
          </span>
          AVFU ID Card Generator
        </span>
        <div className="navlinks">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link key={href} href={href} data-active={active}>
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
