"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinkClass =
  "font-mono text-[14px] font-normal uppercase tracking-[0.1em] text-neutral-500 transition-colors hover:text-neutral-700";

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`${navLinkClass} ${active ? "text-neutral-800" : ""}`}
    >
      {children}
    </Link>
  );
}

function scrollToWorkSection() {
  document.getElementById("work")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeOverlays() {
    setMobileOpen(false);
  }

  function onWorkNavClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/") {
      e.preventDefault();
      scrollToWorkSection();
    }
  }

  const onWork =
    pathname === "/" || pathname === "/work" || pathname.startsWith("/work/");
  const onPlayground = pathname === "/playground";
  const onAbout = pathname === "/about";

  return (
    <>
      <header className="relative z-50 border-b border-neutral-200/90 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-4 md:px-12 md:py-5 lg:px-16">
          <Link
            href="/"
            className="shrink-0 font-mono text-[14px] font-normal uppercase tracking-[0.1em] text-neutral-500 transition-colors hover:text-neutral-700"
          >
            OLIVIA TRAN
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="h-0.5 w-5 bg-neutral-500" />
            <span className="h-0.5 w-5 bg-neutral-500" />
            <span className="h-0.5 w-5 bg-neutral-500" />
            <span className="sr-only">Menu</span>
          </button>

          <nav
            className="hidden items-center gap-[32px] md:flex"
            aria-label="Primary"
          >
            <Link
              href="/#work"
              className={`${navLinkClass} ${onWork ? "text-neutral-800" : ""}`}
              onClick={onWorkNavClick}
            >
              Work
            </Link>
            <NavLink href="/playground" active={onPlayground}>
              Playground
            </NavLink>
            <NavLink href="/about" active={onAbout}>
              About
            </NavLink>
          </nav>
        </div>
      </header>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-40 flex flex-col bg-white pt-20 md:hidden"
        >
          <nav
            className="flex flex-col gap-8 px-8 py-8 font-mono"
            aria-label="Mobile"
          >
            <Link
              href="/#work"
              className={`text-lg uppercase tracking-[0.1em] text-neutral-500 ${onWork ? "text-neutral-800" : ""}`}
              onClick={(e) => {
                closeOverlays();
                onWorkNavClick(e);
              }}
            >
              Work
            </Link>
            <Link
              href="/playground"
              className={`text-lg uppercase tracking-[0.1em] text-neutral-500 ${onPlayground ? "text-neutral-800" : ""}`}
              onClick={closeOverlays}
            >
              Playground
            </Link>
            <Link
              href="/about"
              className={`text-lg uppercase tracking-[0.1em] text-neutral-500 ${onAbout ? "text-neutral-800" : ""}`}
              onClick={closeOverlays}
            >
              About
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}
