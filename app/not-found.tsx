"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChefHat, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center px-6">
        {/* Icon */}
        <div className="mb-8">
          <ChefHat className="h-24 w-24 text-primary mx-auto" />
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The
            page might have been moved or doesn&apos;t exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/meal-planner">
              <ChefHat className="h-4 w-4 mr-2" />
              Start Meal Planning
            </Link>
          </Button>

          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="w-full"
            size="lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Need help? Contact support or visit our help center.</p>
        </div>
      </div>
    </div>
  );
}
