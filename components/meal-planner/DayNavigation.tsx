import DebouncedLink from "@/components/ui/DebouncedLink";
import { MoveLeft, ArrowRight } from "lucide-react";

interface DayNavigationProps {
  mealPlanId: string;
  currentDay: number;
  maxDays: number;
}

export function DayNavigation({
  mealPlanId,
  currentDay,
  maxDays,
}: DayNavigationProps) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-center gap-2">
          {currentDay > 1 && (
            <DebouncedLink
              href={`/meal-planner/${mealPlanId}/day/${currentDay - 1}`}
              className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <MoveLeft size={16} />
            </DebouncedLink>
          )}

          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg font-medium text-sm">
            Day {currentDay} of {maxDays}
          </span>

          {currentDay < maxDays && (
            <DebouncedLink
              href={`/meal-planner/${mealPlanId}/day/${currentDay + 1}`}
              className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <ArrowRight size={16} />
            </DebouncedLink>
          )}
        </div>
      </div>
    </div>
  );
}
