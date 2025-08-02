import { Card } from "@/components/ui/card";
import DebouncedLink from "@/components/ui/DebouncedLink";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { MealPlanHeader } from "./MealPlanHeader";

interface MealPlanErrorProps {
  backHref: string;
  backText: string;
  title: string;
  message: string;
  actionHref?: string;
  actionText?: string;
}

export function MealPlanError({
  backHref,
  backText,
  title,
  message,
  actionHref = "/meal-planner",
  actionText = "Back to Meal Planner",
}: MealPlanErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <MealPlanHeader backHref={backHref} backText={backText} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Card className="text-center py-12 border-red-200 bg-red-50">
          <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-red-700 mb-2">{title}</h3>
          <p className="text-red-600 mb-6">{message}</p>
          <DebouncedLink
            href={actionHref}
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <ArrowRight size={20} />
            {actionText}
          </DebouncedLink>
        </Card>
      </div>
    </div>
  );
}
