export interface NavigationItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

// Main navigation for authenticated users and guests
export const mainNavigation: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
    description: "Go to homepage",
  },
  {
    label: "Meal Planner",
    href: "/meal-planner",
    description:
      "Plan your Filipino meals with budget and auto-generate grocery lists",
  },
  {
    label: "Grocery List",
    href: "/grocery-list",
    description: "Manage your grocery items and shopping lists",
  },
];

// Authentication navigation
export const authNavigation: NavigationItem[] = [
  {
    label: "Login",
    href: "/login",
    description: "Sign in to your account",
  },
  {
    label: "Sign Up",
    href: "/signup",
    description: "Create a new account",
  },
];

// Guest-specific navigation
export const guestNavigation: NavigationItem[] = [
  {
    label: "Continue as Guest",
    href: "/meal-planner?guest=true",
    description: "Start planning without an account",
  },
];

// Optional footer/secondary navigation
export const secondaryNavigation: NavigationItem[] = [
  {
    label: "About",
    href: "/about",
    description: "Learn about Lutong Bahay Planner",
  },
  {
    label: "How It Works",
    href: "/how-it-works",
    description: "Discover how our meal planning works",
  },
];

// Combined navigation structure for easy access
export const navigationConfig = {
  main: mainNavigation,
  auth: authNavigation,
  guest: guestNavigation,
  secondary: secondaryNavigation,
};

// Helper function to get navigation based on user state
export function getNavigationForUser(
  isAuthenticated: boolean,
  isGuest: boolean
) {
  const baseNav = [...mainNavigation];

  if (isAuthenticated) {
    return {
      main: baseNav,
      secondary: secondaryNavigation,
    };
  }

  if (isGuest) {
    return {
      main: baseNav,
      auth: authNavigation,
      secondary: secondaryNavigation,
    };
  }

  // Not authenticated, not guest (new visitor)
  return {
    main: baseNav,
    auth: [...authNavigation, ...guestNavigation],
    secondary: secondaryNavigation,
  };
}
