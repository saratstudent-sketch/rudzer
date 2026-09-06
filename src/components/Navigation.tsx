"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Overview", href: "/" },
    { name: "Live Monitor", href: "/monitor" },
    { name: "3D Map", href: "/map" },
    { name: "Sensors", href: "/sensors" },
    { name: "AI Intelligence", href: "/ai" },
    { name: "Analytics", href: "/analytics" },
    { name: "Alerts", href: "/alerts" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        scrolled ? "bg-background/80 backdrop-blur-md border-white/10" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-xl font-bold tracking-widest text-primaryText">
            R.U.D.Z.E.R- SUBSIDENCE MONITORING
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-secondaryText hover:text-primaryText transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-status-safe animate-pulse shadow-[0_0_8px_rgba(48,209,88,0.6)]" />
          <span className="text-xs font-semibold tracking-wider text-status-safe">
            SYSTEM ONLINE
          </span>
        </div>
      </div>
    </header>
  );
}
