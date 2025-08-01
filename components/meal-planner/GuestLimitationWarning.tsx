"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, User, ArrowRight } from "lucide-react";
import { useGuestLimitations } from "@/lib/hooks/useGuestLimitations";
import { useComingSoonDialog } from "@/components/ui/ComingSoonDialog";

interface GuestLimitationWarningProps {
  className?: string;
}

export const GuestLimitationWarning = ({
  className = "",
}: GuestLimitationWarningProps) => {
  const {
    canCreateMealPlan,
    dailyGenerationLimitReached,
    generationsRemaining,
    generationsUsedToday,
  } = useGuestLimitations();

  const { showDialog, ComingSoonDialog } = useComingSoonDialog();

  if (canCreateMealPlan) {
    // Show remaining count as a friendly reminder
    return (
      <Card className={`border-blue-200 bg-blue-50 ${className}`}>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-200 p-2 rounded-full">
              <Clock size={16} className="text-blue-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-800 mb-1">🎯 Daily Usage</h3>
              <p className="text-sm text-blue-700">
                You've used <strong>{generationsUsedToday}</strong> out of{" "}
                <strong>3</strong> daily meal plan generations.
                <span className="ml-2">
                  <strong>{generationsRemaining}</strong> remaining today.
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Show limitation reached warning
  return (
    <>
      <Card className={`border-orange-200 bg-orange-50 ${className}`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-orange-200 p-2 rounded-full mt-1">
              <AlertTriangle size={20} className="text-orange-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-800 mb-2">
                🚫 Daily Limit Reached
              </h3>

              <p className="text-sm text-orange-700 mb-4">
                You've reached your daily limit of{" "}
                <strong>3 meal plan generations</strong>. Your limit will reset
                at midnight.
              </p>

              <div className="bg-white/60 rounded-lg p-3 mb-4">
                <p className="text-sm text-orange-800">
                  📊 Today's usage: <strong>3/3</strong> generations used
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-orange-700">
                  Create a free account to get unlimited meal plan generations!
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={showDialog}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    size="sm"
                  >
                    <User size={16} className="mr-2" />
                    Create Free Account
                    <ArrowRight size={16} className="ml-2" />
                  </Button>

                  <p className="text-xs text-orange-600 self-center">
                    💡 Limit resets at midnight
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <ComingSoonDialog description="Account creation is coming soon! This will unlock unlimited meal plan generations and permanent storage for your meal plans." />
    </>
  );
};
