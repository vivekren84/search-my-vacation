import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components";
import { siteConfig } from "@/config/site.config";

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8 lg:px-10">
        {/* Logo */}

        <Link
          href="/"
          className="flex shrink-0 items-center"
        >
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={150}
            height={48}
            priority
            className="h-11 w-auto object-contain"
          />
        </Link>

        {/* Navigation */}

        <nav className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-12">
            {siteConfig.navigation.map((item) => (
              <li key={`${item.label}-${item.href}`}>
                <Link
                  href={item.href}
                  className="text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:text-white/75"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA */}

        <div className="flex shrink-0">
          <Button
            variant="secondary"
            size="md"
          >
            Plan My Journey
          </Button>
        </div>
      </div>
    </header>
  );
}