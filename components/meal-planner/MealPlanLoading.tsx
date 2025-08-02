import { Loader2 } from "lucide-react";
import { MealPlanHeader } from "./MealPlanHeader";

interface MealPlanLoadingProps {
  backHref: string;
  backText: string;
  loadingText?: string;
}

export function MealPlanLoading({
  backHref,
  backText,
  loadingText = "Loading your meal plan...",
}: MealPlanLoadingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <MealPlanHeader backHref={backHref} backText={backText} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Loader2 size={32} className="animate-spin text-orange-500" />
          <p className="text-gray-600">{loadingText}</p>
        </div>
      </div>
    </div>
  );
}
