import Header from "@/components/Header";
import SignInFacebook from "@/components/ui/session-buttons/SigninFacebook";
import SignInGoogle from "@/components/ui/session-buttons/SigninGoogle";
import { Button } from "@/components/ui/button";
import DebouncedLink from "@/components/ui/DebouncedLink";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-orange-50">
      <Header />

      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Hero Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="font-bold text-primary leading-tight">
              Welcome to Lutong Bahay Planner
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your go-to app for planning Filipino meals, managing budgets, and
              generating grocery lists.
            </p>

            <ul className="space-y-3 text-left max-w-md mx-auto lg:mx-0">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Browse and select authentic Filipino recipes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Create weekly meal plans</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Track and manage your food budget</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Automatically generate grocery lists</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Save favorite meals for quick access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Personalize plans for your household</span>
              </li>
            </ul>

            <div className="pt-4">
              <DebouncedLink
                href="/meal-planner"
                variant="default"
                size="lg"
                className="w-full sm:w-auto"
                hoverStyle="action"
              >
                Start Planning Now
              </DebouncedLink>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg space-y-6">
            <div className="text-center space-y-4">
              <h2 className="font-bold text-primary">Plan Meals. Save More.</h2>
              <p className="text-muted-foreground">
                Sign in to save your meal plans and sync across devices, or
                continue as a guest.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-3 flex-center flex-col">
                <SignInGoogle />
                <SignInFacebook />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <DebouncedLink
                href="/meal-planner?guest=true"
                variant="outline"
                className="w-full"
                hoverStyle="secondary"
              >
                Continue as Guest
              </DebouncedLink>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Guest mode allows you to try some features. Your data will be
              saved locally.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
