"use client";

import { authNavigation, getNavigationForUser } from "@/lib/navigation";
import DebouncedLink from "./ui/DebouncedLink";
import Logo from "./ui/Logo";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useComingSoonDialog } from "./ui/ComingSoonDialog";
import { Button } from "./ui/button";

export default function Header() {
  const { data } = useSession();
  const isAuthenticated = !!data?.user;
  const searchParams = useSearchParams();
  const isGuest = searchParams.get("guest") === "true";
  const navigations = getNavigationForUser(isAuthenticated, isGuest);
  const { showDialog, ComingSoonDialog } = useComingSoonDialog();

  const handleAuthClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showDialog();
  };

  return (
    <>
      <header className="w-full bg-primary text-primary-foreground shadow-sm h-30">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3 h-full">
          <DebouncedLink href="/" hoverStyle="none">
            <Logo />
          </DebouncedLink>
          <div className="flex gap-4 items-center">
            {authNavigation.map((item) => (
              <Button
                key={item.label}
                variant="link"
                className="text-sm text-primary-foreground p-0 h-auto"
                onClick={handleAuthClick}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </nav>
      </header>

      <ComingSoonDialog description="We're working hard to bring you the authentication feature. For now, you can continue exploring the app as a guest.\n\nYour meal planning adventure awaits! 🍽️" />
    </>
  );
}
