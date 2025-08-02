import { Card } from "@/components/ui/card";

interface DaySummaryCardProps {
  dayNumber: number;
  totalCost: number;
  recipeCount: number;
  totalIngredients: number;
}

export function DaySummaryCard({
  dayNumber,
  totalCost,
  recipeCount,
  totalIngredients,
}: DaySummaryCardProps) {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-green-800 mb-4">
          📊 Day {dayNumber} Summary
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">
              ₱{totalCost.toFixed(2)}
            </div>
            <div className="text-green-600 text-sm">Total Day Cost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">
              {recipeCount}
            </div>
            <div className="text-green-600 text-sm">Recipes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">
              {totalIngredients}
            </div>
            <div className="text-green-600 text-sm">Total Ingredients</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
