"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Logo from "@/components/ui/Logo";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An authentication error occurred. Please try again.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage = errorMessages[error || ""] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Error Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Authentication Error
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm text-gray-700">
                {errorMessage}
              </AlertDescription>
            </Alert>

            {error && (
              <div className="text-xs text-gray-500 text-center">
                Error code: {error}
              </div>
            )}

            <div className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Home
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                If this problem persists, please contact support.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
