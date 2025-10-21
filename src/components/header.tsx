"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Button } from "./ui/button";

const navLinks = [
  { href: "/dashboard", label: "Recipes" },
  { href: "/dashboard/ingredients", label: "Add Ingredients" },
  { href: "/dashboard/waste-tracking", label: "Waste Tracking" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/dashboard" className="mr-8">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
           <Button variant="ghost" size="sm">Log In</Button>
           <Button size="sm">Sign Up</Button>
        </div>
      </div>
    </header>
  );
}
