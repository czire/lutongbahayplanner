"use client";

import { getNavigationForUser, NavigationItem } from "@/lib/navigation";
import DebouncedLink from "./ui/DebouncedLink";
import Logo from "./ui/Logo";
import { useComingSoonDialog } from "./ui/ComingSoonDialog";
import { Button } from "./ui/button";
import { useGuestOrUser } from "@/lib/hooks/useGuestOrUser";
import LogoutButton from "./ui/session-buttons/LogoutButton";
import { User, Settings, Menu } from "lucide-react";
import { HeaderSkeleton } from "./skeletons/HeaderSkeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface HeaderProps {
  leftNavigation?: NavigationItem[];
  rightNavigation?: NavigationItem[];
  onNavigationClick?: (item: NavigationItem) => void;
}

export default function Header({
  leftNavigation,
  rightNavigation,
}: HeaderProps) {
  const { showDialog, ComingSoonDialog } = useComingSoonDialog();
  const { isGuest, user, isAuthenticated, isLoading } = useGuestOrUser();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleAuthClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    router.push(href);
    setIsSheetOpen(false);
  };

  const handleNavItemClick = () => {
    setIsSheetOpen(false); // Close sheet when navigating
  };

  // Check if a navigation item is active
  const isActiveNavItem = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    // For meal-planner, match exact path, meal plan details, and meal plan sub-routes (but not /plans)
    if (href === "/meal-planner") {
      return (
        pathname === "/meal-planner" ||
        (pathname.match(/^\/meal-planner\/[^\/]+/) &&
          !pathname.startsWith("/meal-planner/plans"))
      );
    }
    // For all other routes, check exact match or proper sub-routes
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Determine navigation based on user state
  const navigationForUser = getNavigationForUser(isAuthenticated, isGuest);
  const effectiveLeftNav = leftNavigation || navigationForUser.main;
  const effectiveRightNav = rightNavigation || navigationForUser.auth || [];

  const hasLeftNav = effectiveLeftNav && effectiveLeftNav.length > 0;
  const hasRightNav = effectiveRightNav && effectiveRightNav.length > 0;

  return (
    <>
      <header className="w-full bg-primary text-primary-foreground shadow-sm h-32">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 h-full">
          {/* Logo */}
          <DebouncedLink href="/" hoverStyle="none">
            <Logo />
          </DebouncedLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Left Navigation */}
            {hasLeftNav && (
              <div className="flex gap-6 items-center">
                {effectiveLeftNav.map((item) => (
                  <DebouncedLink
                    key={item.label}
                    href={item.href}
                    className={`text-sm transition-colors ${
                      isActiveNavItem(item.href)
                        ? "text-primary-foreground font-medium border-b-2 border-primary-foreground/80 pb-1"
                        : "text-primary-foreground/80 hover:text-primary-foreground"
                    }`}
                    hoverStyle="navigation"
                  >
                    {item.label}
                  </DebouncedLink>
                ))}
              </div>
            )}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex gap-4 items-center">
            {isLoading ? (
              <HeaderSkeleton />
            ) : isAuthenticated && user ? (
              // Authenticated User
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-primary-foreground">
                  <User size={16} />
                  <span>Welcome, {user.name || user.email}</span>
                </div>
                {/* <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:text-primary-foreground/80"
                  onClick={() => showDialog()}
                >
                  <Settings size={16} className="mr-1" />
                  Settings
                </Button> */}
                <LogoutButton
                  variant="outline"
                  size="sm"
                  className="text-primary-foreground border-primary-foreground/20 hover:bg-red-500 hover:border-red-500 hover:text-white"
                />
              </div>
            ) : isGuest ? (
              // Guest User
              <div className="flex items-center gap-4">
                {hasRightNav &&
                  effectiveRightNav.map((item) => (
                    <Button
                      key={item.label}
                      variant="outline"
                      size="sm"
                      className="text-primary border-primary-foreground/20 hover:bg-primary-foreground/10"
                      onClick={(e) => handleAuthClick(e, item.href)}
                    >
                      {item.label}
                    </Button>
                  ))}
              </div>
            ) : (
              // New Visitor (not authenticated, not guest)
              hasRightNav && (
                <div className="flex gap-3 items-center">
                  {effectiveRightNav.map((item) => (
                    <Button
                      key={item.label}
                      variant={
                        item.label === "Sign Up" ? "secondary" : "outline"
                      }
                      size="sm"
                      className={
                        item.label === "Sign Up"
                          ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                          : "text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
                      }
                      onClick={(e) => handleAuthClick(e, item.href)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:text-primary-foreground/80"
                >
                  <Menu size={20} />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 p-0 flex flex-col h-full"
              >
                <div className="p-6 border-b">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Logo />
                    </SheetTitle>
                    <SheetDescription>
                      {isGuest
                        ? "You're browsing as a guest"
                        : isAuthenticated
                        ? `Welcome back, ${user?.name || user?.email}!`
                        : "Navigate through the app"}
                    </SheetDescription>
                  </SheetHeader>
                </div>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                  {/* Navigation Links */}
                  {hasLeftNav && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">
                        Navigation
                      </h3>
                      <div className="space-y-2">
                        {effectiveLeftNav.map((item) => (
                          <DebouncedLink
                            key={item.label}
                            href={item.href}
                            className={`block px-4 py-2 rounded-md transition-colors ${
                              isActiveNavItem(item.href)
                                ? "bg-primary text-primary-foreground font-medium"
                                : "text-foreground hover:bg-accent"
                            }`}
                            onClick={handleNavItemClick}
                          >
                            {item.label}
                          </DebouncedLink>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* User Actions */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Account</h3>
                    <div className="space-y-2">
                      {isLoading ? (
                        <div className="px-4 py-2">
                          <HeaderSkeleton />
                        </div>
                      ) : isAuthenticated && user ? (
                        // Authenticated User Mobile
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                            <User size={16} />
                            <span>{user.name || user.email}</span>
                          </div>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              showDialog();
                              setIsSheetOpen(false);
                            }}
                          >
                            <Settings size={16} className="mr-2" />
                            Settings
                          </Button>
                        </div>
                      ) : isGuest ? (
                        // Guest User Mobile
                        <div className="space-y-2">
                          <div className="px-4 py-2 text-sm text-muted-foreground">
                            👋 Guest Mode
                          </div>
                          {hasRightNav &&
                            effectiveRightNav.map((item) => (
                              <Button
                                key={item.label}
                                variant="outline"
                                className="w-full justify-start"
                                onClick={(e) => handleAuthClick(e, item.href)}
                              >
                                {item.label}
                              </Button>
                            ))}
                        </div>
                      ) : (
                        // New Visitor Mobile
                        hasRightNav && (
                          <div className="space-y-2">
                            {effectiveRightNav.map((item) => (
                              <Button
                                key={item.label}
                                variant={
                                  item.label === "Sign Up"
                                    ? "default"
                                    : "outline"
                                }
                                className="w-full justify-start"
                                onClick={(e) => handleAuthClick(e, item.href)}
                              >
                                {item.label}
                              </Button>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Only show logout for authenticated users */}
                {isAuthenticated && user && (
                  <div className="p-6 border-t mt-auto">
                    <LogoutButton
                      variant="outline"
                      className="w-full justify-start"
                      showIcon={true}
                    />
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      <ComingSoonDialog />
    </>
  );
}
