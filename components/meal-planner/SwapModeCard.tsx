"use client";

import { Card, CardContent } from "@/components/ui/card";

interface SwapModeCardProps {
  selectedMealForSwap: string | null;
}

export const SwapModeCard = ({ selectedMealForSwap }: SwapModeCardProps) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="pt-4">
        <p className="text-sm text-blue-800">
          <strong>Swap Mode Active:</strong> Click on two meals to swap their
          positions.
          {selectedMealForSwap &&
            " Click on another meal to complete the swap."}
        </p>
      </CardContent>
    </Card>
  );
};
