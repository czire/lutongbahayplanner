"use client";

import { authNavigation, NavigationItem } from "@/lib/navigation";
import DebouncedLink from "./ui/DebouncedLink";
import Logo from "./ui/Logo";
import { useComingSoonDialog } from "./ui/ComingSoonDialog";
import { Button } from "./ui/button";

interface HeaderProps {
  leftNavigation?: NavigationItem[];
  rightNavigation?: NavigationItem[];
  onNavigationClick?: (item: NavigationItem) => void;
}

export default function Header({
  leftNavigation,
  rightNavigation = authNavigation,
  onNavigationClick,
}: HeaderProps) {
  const { showDialog, ComingSoonDialog } = useComingSoonDialog();

  const handleAuthClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showDialog();
  };

  const handleNavClick = (item: NavigationItem) => {
    if (onNavigationClick) {
      onNavigationClick(item);
    } else {
      // Default behavior for auth navigation
      handleAuthClick;
    }
  };

  // Determine layout based on navigation props
  const hasLeftNav = leftNavigation && leftNavigation.length > 0;
  const hasRightNav = rightNavigation && rightNavigation.length > 0;

  return (
    <>
      <header className="w-full bg-primary text-primary-foreground shadow-sm h-30">
        <nav className="max-w-5xl mx-auto flex items-center px-4 py-3 h-full">
          {/* Logo */}
          <DebouncedLink href="/" hoverStyle="none">
            <Logo />
          </DebouncedLink>

          {/* Left Navigation (if provided) */}
          {hasLeftNav && (
            <div className="flex gap-4 items-center ml-8">
              {leftNavigation.map((item) => (
                <DebouncedLink
                  key={item.label}
                  href={item.href}
                  className="text-sm text-primary-foreground"
                  hoverStyle="navigation"
                >
                  {item.label}
                </DebouncedLink>
              ))}
            </div>
          )}

          {/* Spacer - grows to push right nav to the end */}
          <div className="flex-1" />

          {/* Right Navigation */}
          {hasRightNav && (
            <div className="flex gap-4 items-center">
              {rightNavigation.map((item) => (
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
          )}
        </nav>
      </header>

      <ComingSoonDialog
        description={`We're working hard to bring you the authentication feature. For now, you can continue exploring the app as a guest.

Your meal planning adventure awaits! 🍽️`}
      />
    </>
  );
}
