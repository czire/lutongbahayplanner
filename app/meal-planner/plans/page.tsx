"use client";

import { useUser } from "@/lib/contexts/UserContext";

// Unified meal plan type that works for both guests and users
interface UnifiedMealPlan {
  id: string;
  budget: number;
  startDate: string | Date;
  endDate: string | Date;
  meals: any[];
  createdAt: Date | string;
  // User-specific properties
  userId?: string;
}
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DebouncedLink from "@/components/ui/DebouncedLink";
import { Loader, Calendar, DollarSign, Utensils, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const MyPlansPage = () => {
  const {
    isAuthenticated,
    isGuest,
    isLoading,
    savedMealPlans,
    deleteMealPlan,
    refreshMealPlans,
    isLoadingMealPlans,
  } = useUser();

  // Ensure savedMealPlans is properly typed
  const typedSavedMealPlans: UnifiedMealPlan[] = savedMealPlans;

  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const handleDeletePlan = async (planId: string) => {
    setDeletingPlanId(planId);
    try {
      await deleteMealPlan(planId);
      await refreshMealPlans();
      toast.success("Meal plan deleted successfully!", {
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to delete meal plan:", error);
      toast.error("Failed to delete meal plan. Please try again.", {
        duration: 3000,
      });
    } finally {
      setDeletingPlanId(null);
    }
  };

  // Show loading state
  if (isLoading || isLoadingMealPlans) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-primary h-8 w-8" />
      </div>
    );
  }

  // Guest users can't access this page
  if (isGuest) {
    return (
      <div className="text-center space-y-6">
        <div className="bg-orange-50 rounded-lg p-8 border border-orange-200">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Sign In Required
          </h1>
          <p className="text-gray-600 mb-6">
            You need to sign in to view and manage your saved meal plans.
          </p>
          <DebouncedLink
            href="/meal-planner"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            Back to Meal Planner
          </DebouncedLink>
        </div>
      </div>
    );
  }

  // No meal plans found
  if (!typedSavedMealPlans || typedSavedMealPlans.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            My Meal Plans
          </h1>
          <p className="text-lg text-gray-600">
            Manage and view all your saved meal plans
          </p>
        </div>

        <div className="text-center">
          <div className="bg-orange-50 rounded-lg p-8 border border-orange-200">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Meal Plans Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't saved any meal plans yet. Create your first meal plan
              to get started!
            </p>
            <DebouncedLink
              href="/meal-planner"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              Create My First Meal Plan
            </DebouncedLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          My Meal Plans
        </h1>
        <p className="text-lg text-gray-600">
          Manage and view all your saved meal plans (
          {typedSavedMealPlans.length} plans)
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <DebouncedLink
          href="/meal-planner"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
        >
          + Create New Plan
        </DebouncedLink>

        <Button
          variant="outline"
          onClick={() => refreshMealPlans()}
          disabled={isLoadingMealPlans}
        >
          {isLoadingMealPlans ? (
            <Loader className="w-4 h-4 animate-spin mr-2" />
          ) : (
            "Refresh"
          )}
        </Button>
      </div>

      {/* Meal Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {typedSavedMealPlans.map((plan: UnifiedMealPlan) => (
          <Card
            key={plan.id}
            className="shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <CardHeader className="bg-gradient-to-r from-orange-100 to-yellow-100">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Weekly Plan
              </CardTitle>
              <CardDescription className="text-gray-600">
                Created {new Date(plan.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Plan Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">₱{plan.budget}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Utensils className="w-4 h-4" />
                  <span>{plan.meals?.length || 0} meals</span>
                </div>
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(plan.startDate).toLocaleDateString()} -{" "}
                  {new Date(plan.endDate).toLocaleDateString()}
                </span>
              </div>

              {/* Quick Preview */}
              <div className="text-xs text-gray-500">
                {Math.ceil((plan.meals?.length || 0) / 3)} days planned
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <DebouncedLink
                  href={`/meal-planner/${plan.id}/overview`}
                  className="flex-1 text-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm"
                  size="sm"
                >
                  View Details
                </DebouncedLink>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={deletingPlanId === plan.id}
                    >
                      {deletingPlanId === plan.id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Meal Plan</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this meal plan? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeletePlan(plan.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyPlansPage;
