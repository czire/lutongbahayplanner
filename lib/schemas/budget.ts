import { z } from "zod";

export const budgetSchema = z.object({
  budget: z
    .number()
    .nonnegative("Budget must be a positive number")
    .int("Budget must be an integer")
    .min(100, "Budget must be at least ₱100")
    .max(50000, "Budget cannot exceed ₱50,000"),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;
