import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // Skip auth check for API routes to prevent JSON parsing errors
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const guestAllowedPaths = ["/", "/meal-planner"];

  // Check if it's a meal plan detail page (e.g., /meal-planner/abc123)
  const isMealPlanDetail = /^\/meal-planner\/[^\/]+$/.test(pathname);

  const isGuestPath = guestAllowedPaths.includes(pathname) || isMealPlanDetail;

  // Block guests from accessing restricted paths
  if (!isLoggedIn && !isGuestPath) {
    return NextResponse.redirect(new URL("/meal-planner", req.url));
  }

  return NextResponse.next();
});

// Add matcher to improve performance
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
