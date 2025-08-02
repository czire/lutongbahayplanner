interface DayMeals {
  date: Date;
  dayNumber: number;
  breakfast?: any;
  lunch?: any;
  dinner?: any;
  completeMeals: number;
}

interface UnifiedMealPlan {
  id: string;
  budget: number;
  startDate: string | Date;
  endDate: string | Date;
  meals: any[];
  createdAt: Date | string;
  userId?: string;
}

export function groupMealsByDays(mealPlan: UnifiedMealPlan): DayMeals[] {
  if (!mealPlan || !mealPlan.meals || mealPlan.meals.length === 0) {
    return [];
  }

  const startDate = new Date(mealPlan.startDate);
  const numberOfDays = Math.ceil(mealPlan.meals.length / 3);
  const days: DayMeals[] = [];

  for (let dayIndex = 0; dayIndex < numberOfDays; dayIndex++) {
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + dayIndex);

    const dayMeals = mealPlan.meals.slice(dayIndex * 3, (dayIndex + 1) * 3);

    const breakfast =
      dayMeals.find((meal) => meal.type === "BREAKFAST") || dayMeals[0];
    const lunch = dayMeals.find((meal) => meal.type === "LUNCH") || dayMeals[1];
    const dinner =
      dayMeals.find((meal) => meal.type === "DINNER") || dayMeals[2];

    const completeMeals = [breakfast, lunch, dinner].filter(
      (meal) => meal
    ).length;

    days.push({
      date: dayDate,
      dayNumber: dayIndex + 1,
      breakfast,
      lunch,
      dinner,
      completeMeals,
    });
  }

  return days;
}

export function getDayMeals(mealPlan: UnifiedMealPlan, dayNumber: number) {
  const startIndex = (dayNumber - 1) * 3;
  const endIndex = startIndex + 3;
  const dayMeals = mealPlan.meals.slice(startIndex, endIndex);

  // Calculate the date for this day
  const startDate = new Date(mealPlan.startDate);
  const dayDate = new Date(startDate);
  dayDate.setDate(startDate.getDate() + (dayNumber - 1));

  return {
    date: dayDate,
    breakfast:
      dayMeals.find((meal) => meal.type === "BREAKFAST") || dayMeals[0],
    lunch: dayMeals.find((meal) => meal.type === "LUNCH") || dayMeals[1],
    dinner: dayMeals.find((meal) => meal.type === "DINNER") || dayMeals[2],
    allMeals: dayMeals.filter((meal) => meal && meal.recipe),
  };
}

export function calculateRecipeCost(recipe: any): number {
  return (
    recipe.ingredients?.reduce(
      (sum: number, ingredient: any) => sum + (ingredient.price || 0),
      0
    ) || 0
  );
}
