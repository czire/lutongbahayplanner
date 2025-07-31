export interface Feature {
  id: string;
  text: string;
  icon?: string;
}

export interface LandingPageData {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
  };
  features: Feature[];
  cta: {
    title: string;
    description: string;
    guestCta: {
      text: string;
      link: string;
    };
    guestNote: string;
  };
}

export const landingPageData: LandingPageData = {
  hero: {
    title: "Welcome to Lutong Bahay Planner",
    subtitle:
      "Your go-to app for planning Filipino meals, managing budgets, and generating grocery lists.",
    ctaText: "Start Planning Now",
    ctaLink: "/meal-planner",
  },
  features: [
    {
      id: "recipes",
      text: "Browse and select authentic Filipino recipes",
    },
    {
      id: "meal-plans",
      text: "Create weekly meal plans",
    },
    {
      id: "budget",
      text: "Track and manage your food budget",
    },
    {
      id: "grocery-lists",
      text: "Automatically generate grocery lists",
    },
    {
      id: "favorites",
      text: "Save favorite meals for quick access",
    },
    {
      id: "personalize",
      text: "Personalize plans for your household",
    },
  ],
  cta: {
    title: "Plan Meals. Save More.",
    description:
      "Sign in to save your meal plans and sync across devices, or continue as a guest.",
    guestCta: {
      text: "Continue as Guest",
      link: "/meal-planner?guest=true",
    },
    guestNote:
      "Guest mode allows you to try some features. Your data will be saved locally.",
  },
};
