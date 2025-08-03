export const routes = {
  // Main pages
  home: "/",
  mealPlanner: "/meal-planner",
  myPlans: "/meal-planner/plans",
  groceryList: "/grocery-list",

  // Authentication
  login: "/auth/login",
  signup: "/auth/signup",

  // Guest flow
  guestMealPlanner: "/meal-planner?guest=true",

  // Secondary pages
  about: "/about",
  howItWorks: "/how-it-works",

  // API routes
  api: {
    auth: "/api/auth",
    guestClear: "/api/guest/clear",
  },
} as const;

export type RouteKey = keyof typeof routes;
