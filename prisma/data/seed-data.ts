export const globalIngredients = [
  "Chicken",
  "Pork",
  "Beef",
  "Shrimp",
  "Fish",
  "Rice",
  "Noodles",
  "Onion",
  "Garlic",
  "Ginger",
  "Tomato",
  "Potato",
  "Carrot",
  "Soy sauce",
  "Vinegar",
  "Fish sauce",
  "Oil",
  "Salt",
  "Pepper",
];

export const userIngredients = [
  { name: "Leftover rice", quantity: "2", unit: "cups" },
  { name: "Onions", quantity: "3", unit: "pieces" },
  { name: "Garlic", quantity: "1", unit: "head" },
  { name: "Soy sauce", quantity: "1", unit: "bottle" },
];

export const testUserData = {
  email: "test@example.com",
  name: "Test User",
  role: "user",
};

export const mealPlanData = {
  budget: 1500.0, // ₱1500 for the week
  durationDays: 7,
};

export const mealTypes = ["BREAKFAST", "LUNCH", "DINNER"] as const;
