import { ReactNode } from "react";
import { GuestBanner } from "@/components/ui/GuestBanner";

interface MealPlanLayoutProps {
  children: ReactNode;
  isGuest?: boolean;
  showGuestBanner?: boolean;
}

export function MealPlanLayout({
  children,
  isGuest = false,
  showGuestBanner = true,
}: MealPlanLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Guest Banner */}
        {isGuest && showGuestBanner && (
          <GuestBanner className="mb-6" showLimits={false} dismissible={true} />
        )}

        {children}
      </div>
    </div>
  );
}
