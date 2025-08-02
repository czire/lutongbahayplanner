import { Card } from "@/components/ui/card";
import DebouncedLink from "@/components/ui/DebouncedLink";
import { Calendar } from "lucide-react";

interface DayMeals {
  date: Date;
  dayNumber: number;
  breakfast?: any;
  lunch?: any;
  dinner?: any;
  completeMeals: number;
}

interface DayCardProps {
  day: DayMeals;
  mealPlanId: string | string[];
}

export function DayCard({ day, mealPlanId }: DayCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Day {day.dayNumber}
            </h3>
            <p className="text-gray-600">
              {day.date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                day.completeMeals === 3
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {day.completeMeals}/3 meals
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Meals Grid */}
        <div className="grid gap-3 mb-4">
          {/* Breakfast */}
          <MealPreview
            emoji="🌅"
            title="Breakfast"
            meal={day.breakfast}
            bgColor="bg-orange-50"
          />

          {/* Lunch */}
          <MealPreview
            emoji="🌞"
            title="Lunch"
            meal={day.lunch}
            bgColor="bg-yellow-50"
          />

          {/* Dinner */}
          <MealPreview
            emoji="🌆"
            title="Dinner"
            meal={day.dinner}
            bgColor="bg-orange-50"
          />
        </div>

        {/* Action Button */}
        <DebouncedLink
          href={`/meal-planner/${mealPlanId}/day/${day.dayNumber}`}
          className="w-full justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
          variant="default"
        >
          <Calendar size={16} className="mr-2" />
          View Day {day.dayNumber} Details
        </DebouncedLink>
      </div>
    </Card>
  );
}

interface MealPreviewProps {
  emoji: string;
  title: string;
  meal?: any;
  bgColor: string;
}

function MealPreview({ emoji, title, meal, bgColor }: MealPreviewProps) {
  return (
    <div className={`flex items-center gap-3 p-3 ${bgColor} rounded-lg`}>
      <div className="text-2xl">{emoji}</div>
      <div className="flex-1">
        <div className="font-medium text-gray-700">{title}</div>
        {meal ? (
          <div className="text-sm text-gray-600">
            {meal.recipe?.name || "Recipe details available"}
          </div>
        ) : (
          <div className="text-sm text-gray-400">
            No {title.toLowerCase()} planned
          </div>
        )}
      </div>
    </div>
  );
}
