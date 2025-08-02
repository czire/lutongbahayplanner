import DebouncedLink from "@/components/ui/DebouncedLink";
import { MoveLeft, ArrowRight, ChefHat, Calendar } from "lucide-react";

interface MealPlanHeaderProps {
  backHref: string;
  backText: string;
  actions?: Array<{
    href: string;
    text: string;
    icon?: React.ReactNode;
    className?: string;
  }>;
}

export function MealPlanHeader({
  backHref,
  backText,
  actions = [],
}: MealPlanHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <DebouncedLink
            href={backHref}
            hoverStyle="brand"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            <MoveLeft size={20} />
            {backText}
          </DebouncedLink>

          {actions.length > 0 && (
            <div className="flex items-center gap-3">
              {actions.map((action, index) => (
                <DebouncedLink
                  key={index}
                  href={action.href}
                  className={
                    action.className ||
                    "inline-flex items-center gap-2 bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2 rounded-lg transition-colors font-medium"
                  }
                >
                  {action.icon}
                  {action.text}
                </DebouncedLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
