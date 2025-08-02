import { Clock } from "lucide-react";

interface MealPlanStatsProps {
  budget: number;
  startDate: string | Date;
  endDate: string | Date;
  daysPlanned: number;
  totalMeals: number;
  additionalStats?: React.ReactNode;
}

export function MealPlanStats({
  budget,
  startDate,
  endDate,
  daysPlanned,
  totalMeals,
  additionalStats,
}: MealPlanStatsProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
        Budget: ₱{budget.toFixed(2)}
      </div>
      <div className="text-gray-600 flex items-center gap-2">
        <Clock size={16} />
        {new Date(startDate).toLocaleDateString()} -{" "}
        {new Date(endDate).toLocaleDateString()}
      </div>
      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
        {daysPlanned} {daysPlanned === 1 ? "Day" : "Days"} Planned
      </div>
      <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
        {totalMeals} Total Meals
      </div>
      {additionalStats}
    </div>
  );
}
