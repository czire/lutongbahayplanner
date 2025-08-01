// Navigation configuration for different user states and app sections
export { navigationConfig, getNavigationForUser } from "./config";
export type { NavigationItem, NavigationSection } from "./config";

// Route constants for type-safe navigation
export { routes } from "./routes";
export type { RouteKey } from "./routes";

// Re-export for convenience
export * from "./config";
export * from "./routes";
