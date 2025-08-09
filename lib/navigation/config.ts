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
    label: "My Plans",
    href: "/meal-planner/plans",
    description: "View and manage your saved meal plans",
  },
];

// Authentication navigation
export const authNavigation: NavigationItem[] = [
  {
    label: "Login",
    href: "/auth/login", // updated path
    description: "Sign in to your account",
  },
  {
    label: "Sign Up",
    href: "/auth/signup", // updated path
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
  // Filter navigation based on user state
  let filteredMainNav = [...mainNavigation];

  if (!isAuthenticated) {
    // Remove "My Plans" for guests and non-authenticated users
    filteredMainNav = mainNavigation.filter(
      (item) => item.href !== "/meal-planner/plans"
    );
  }

  if (isAuthenticated) {
    return {
      main: filteredMainNav,
      secondary: secondaryNavigation,
    };
  }

  if (isGuest) {
    return {
      main: filteredMainNav,
      auth: authNavigation,
      secondary: secondaryNavigation,
    };
  }

  // Not authenticated, not guest (new visitor)
  return {
    main: filteredMainNav,
    auth: [...authNavigation, ...guestNavigation],
    secondary: secondaryNavigation,
  };
}
