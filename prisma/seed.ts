import { PrismaClient } from "@prisma/client";
import { filipinoRecipes } from "./data/recipes";
import {
  globalIngredients,
  userIngredients,
  testUserData,
  mealPlanData,
  mealTypes,
} from "./data/seed-data";

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.substitution.deleteMany();
  await prisma.step.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.mealPlan.deleteMany();
  await prisma.userIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Cleared existing data");
}

async function createTestUser() {
  const testUser = await prisma.user.create({
    data: testUserData,
  });

  console.log("👤 Created test user");
  return testUser;
}

async function createGlobalIngredients() {
  for (const ingredientName of globalIngredients) {
    await prisma.ingredient.create({
      data: { name: ingredientName },
    });
  }

  console.log("🥬 Created global ingredients");
}

async function createRecipes() {
  for (const recipeData of filipinoRecipes) {
    const recipe = await prisma.recipe.create({
      data: {
        name: recipeData.name,
        description: recipeData.description,
        servings: recipeData.servings,
        cookingTime: recipeData.cookingTime,
        costPerServing: recipeData.costPerServing,
        image: recipeData.image,
      },
    });

    // Add ingredients to recipe
    for (const ingredient of recipeData.ingredients) {
      await prisma.recipeIngredient.create({
        data: {
          recipeId: recipe.id,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        },
      });
    }

    // Add steps to recipe
    for (const [index, stepText] of recipeData.steps.entries()) {
      await prisma.step.create({
        data: {
          recipeId: recipe.id,
          order: index + 1,
          text: stepText,
        },
      });
    }

    // Add substitutions to recipe
    for (const substitution of recipeData.substitutions) {
      await prisma.substitution.create({
        data: {
          recipeId: recipe.id,
          originalItem: substitution.originalItem,
          alternative: substitution.alternative,
        },
      });
    }

    console.log(`🍽️  Created recipe: ${recipe.name}`);
  }
}

async function createSampleMealPlan(userId: string) {
  const recipes = await prisma.recipe.findMany();
  const startDate = new Date();
  const endDate = new Date(
    Date.now() + mealPlanData.durationDays * 24 * 60 * 60 * 1000
  );

  const mealPlan = await prisma.mealPlan.create({
    data: {
      userId,
      startDate,
      endDate,
      budget: mealPlanData.budget,
    },
  });

  // Add meals to the meal plan
  for (let day = 0; day < mealPlanData.durationDays; day++) {
    const mealDate = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);

    for (let mealIndex = 0; mealIndex < 3; mealIndex++) {
      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

      await prisma.meal.create({
        data: {
          mealPlanId: mealPlan.id,
          recipeId: randomRecipe.id,
          date: mealDate,
          type: mealTypes[mealIndex],
        },
      });
    }
  }

  console.log(
    `📅 Created sample meal plan with ${mealPlanData.durationDays * 3} meals`
  );
}

async function createUserIngredients(userId: string) {
  for (const ingredient of userIngredients) {
    await prisma.userIngredient.create({
      data: {
        userId,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      },
    });
  }

  console.log("🥬 Created user ingredients");
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await clearDatabase();

  // Create test user
  const testUser = await createTestUser();

  // Create global ingredients
  await createGlobalIngredients();

  // Create recipes with ingredients, steps, and substitutions
  await createRecipes();

  // Create sample meal plan
  await createSampleMealPlan(testUser.id);

  // Create user ingredients
  await createUserIngredients(testUser.id);

  console.log("✅ Seeding completed successfully!");
  console.log(`📊 Created:`);
  console.log(`   - ${filipinoRecipes.length} Filipino recipes`);
  console.log(`   - ${globalIngredients.length} global ingredients`);
  console.log(`   - 1 test user`);
  console.log(
    `   - 1 weekly meal plan with ${mealPlanData.durationDays * 3} meals`
  );
  console.log(`   - ${userIngredients.length} user ingredients`);
}

main()
  .catch((e: Error) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
