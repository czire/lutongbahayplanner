"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import DebouncedLink from "@/components/ui/DebouncedLink";
import { X, User, Clock, ArrowRight, Info } from "lucide-react";
import ComingSoonDialog from "./ComingSoonDialog";

interface GuestBannerProps {
  className?: string;
  dismissible?: boolean;
  showLimits?: boolean;
}

export const GuestBanner = ({
  className = "",
  dismissible = true,
  showLimits = true,
}: GuestBannerProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  if (isDismissed) return null;

  return (
    <Card
      className={`bg-gradient-to-r from-orange-100 to-amber-100 border-orange-200 shadow-sm ${className}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Icon */}
            <div className="bg-orange-200 p-2 rounded-full mt-1">
              <User size={20} className="text-orange-700" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-orange-800">
                  👋 You're using Lutong Bahay Planner as a Guest
                </h3>
              </div>

              <p className="text-orange-700 text-sm mb-3 leading-relaxed">
                Your meal plans are temporarily stored and may be lost if you
                clear your browser data. Create an account to save your plans
                permanently and unlock additional features!
              </p>

              {showLimits && (
                <div className="bg-white/60 rounded-lg p-3 mb-3">
                  <h4 className="text-sm font-medium text-orange-800 mb-2 flex items-center gap-1">
                    <Info size={16} />
                    Guest Limitations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-orange-700">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>Limited to 5 meal plans per session</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span>No meal plan history</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600">💾</span>
                      <span>Data may be lost on browser close</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600">🔒</span>
                      <span>Limited customization options</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowComingSoon(true)}
                  className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                >
                  <User size={16} />
                  Create Free Account
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => setShowComingSoon(true)}
                  className="inline-flex items-center gap-2 text-orange-700 hover:text-orange-800 transition-colors text-sm font-medium underline"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          </div>

          {/* Dismiss Button */}
          {dismissible && (
            <button
              onClick={() => setIsDismissed(true)}
              className="text-orange-600 hover:text-orange-800 transition-colors p-1 rounded-full hover:bg-orange-200/50"
              aria-label="Dismiss banner"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <ComingSoonDialog
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        description="User authentication and account management features are coming soon! For now, you can continue using the meal planner as a guest."
      />
    </Card>
  );
};
