import { Card } from "@/components/ui/card";
import DebouncedLink from "@/components/ui/DebouncedLink";

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  actionHref: string;
  actionText: string;
  actionIcon?: React.ReactNode;
}

export function EmptyState({
  emoji,
  title,
  description,
  actionHref,
  actionText,
  actionIcon,
}: EmptyStateProps) {
  return (
    <Card className="text-center py-12">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      <DebouncedLink
        href={actionHref}
        className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
      >
        {actionIcon}
        {actionText}
      </DebouncedLink>
    </Card>
  );
}
