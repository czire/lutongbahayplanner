"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import {
  useGuestSession,
  useGuestMealPlans,
} from "@/providers/GuestSessionProvider";
import { useGuestLimitations } from "@/lib/hooks/useGuestLimitations";

// User actions
import {
  getUserMealPlans,
  getUserIngredients,
} from "@/lib/actions/user-actions";

import type { User } from "next-auth";
import type { GuestSessionData, GuestMealPlan } from "@/lib/types/guest";
import type {
  UserMealPlan,
  UserIngredient,
  CreateUserMealPlanData,
  CreateUserIngredientData,
} from "@/lib/types/user";

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

interface UserContextType {
  // User identification
  user: User | null;
  guestSession: GuestSessionData | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;

  // Unified meal plan operations
  mealPlans: UnifiedMealPlan[];
  createMealPlan: (data: {
    budget: number;
    startDate?: string;
    endDate?: string;
  }) => Promise<UnifiedMealPlan>;
  deleteMealPlan: (id: string) => Promise<void>;
  refreshMealPlans: () => Promise<void>;
  isLoadingMealPlans: boolean;

  // Limitations (guests have limits, users don't)
  canCreateMealPlan: boolean;
  generationsRemaining: number;
  generationsUsedToday: number;
  dailyGenerationLimitReached: boolean;

  // User ingredients (users only)
  userIngredients: UserIngredient[];
  addUserIngredient?: (
    ingredient: CreateUserIngredientData
  ) => Promise<UserIngredient>;
  deleteUserIngredient?: (id: string) => Promise<void>;
  refreshUserIngredients: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const { guestSession, isLoading: guestLoading } = useGuestSession();

  // Determine user state
  const isAuthenticated = !!session?.user;
  const isGuest = !isAuthenticated && !!guestSession;
  const isLoading = status === "loading" || guestLoading;

  // Guest hooks (existing functionality)
  const guestMealPlansHook = useGuestMealPlans();
  const guestLimitations = useGuestLimitations();

  // User state
  const [userMealPlans, setUserMealPlans] = useState<UserMealPlan[]>([]);
  const [userIngredients, setUserIngredients] = useState<UserIngredient[]>([]);
  const [isLoadingMealPlans, setIsLoadingMealPlans] = useState(false);

  // Fetch user data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserMealPlans();
      fetchUserIngredients();
    }
  }, [isAuthenticated]);

  const fetchUserMealPlans = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoadingMealPlans(true);
    try {
      const plans = await getUserMealPlans();
      setUserMealPlans(plans);
    } catch (error) {
      console.error("Failed to fetch user meal plans:", error);
    } finally {
      setIsLoadingMealPlans(false);
    }
  }, [isAuthenticated]);

  const fetchUserIngredients = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const ingredients = await getUserIngredients();
      setUserIngredients(ingredients);
    } catch (error) {
      console.error("Failed to fetch user ingredients:", error);
    }
  }, [isAuthenticated]);

  // Placeholder functions - will implement meal plan operations later
  const createMealPlan = async (data: {
    budget: number;
    startDate?: string;
    endDate?: string;
  }): Promise<UnifiedMealPlan> => {
    // TODO: Implement unified meal plan creation
    throw new Error("Not implemented yet");
  };

  const deleteMealPlan = async (id: string): Promise<void> => {
    // TODO: Implement unified meal plan deletion
    throw new Error("Not implemented yet");
  };

  const refreshMealPlans = async (): Promise<void> => {
    if (isGuest) {
      // Guest meal plans don't have a refresh method, they auto-update via the session
      // The guestMealPlansHook.mealPlans will automatically reflect changes
    } else if (isAuthenticated) {
      await fetchUserMealPlans();
    }
  };

  // Placeholder user ingredient operations
  const addUserIngredientAction = async (
    ingredient: CreateUserIngredientData
  ): Promise<UserIngredient> => {
    // TODO: Implement user ingredient addition
    throw new Error("Not implemented yet");
  };

  const deleteUserIngredientAction = async (id: string): Promise<void> => {
    // TODO: Implement user ingredient deletion
    throw new Error("Not implemented yet");
  };

  const value: UserContextType = {
    // User identification - migrated from useGuestOrUser hook
    user: session?.user || null,
    guestSession,
    isAuthenticated,
    isGuest,
    isLoading,

    // Unified meal plans (route to appropriate source)
    mealPlans: isGuest ? guestMealPlansHook.mealPlans : userMealPlans,
    createMealPlan,
    deleteMealPlan,
    refreshMealPlans,
    isLoadingMealPlans: isGuest ? false : isLoadingMealPlans, // Guest doesn't have loading state

    // Limitations (guests only)
    canCreateMealPlan: isGuest ? guestLimitations.canCreateMealPlan : true,
    generationsRemaining: isGuest
      ? guestLimitations.generationsRemaining
      : Infinity,
    generationsUsedToday: isGuest ? guestLimitations.generationsUsedToday : 0,
    dailyGenerationLimitReached: isGuest
      ? guestLimitations.dailyGenerationLimitReached
      : false,

    // User ingredients (authenticated users only)
    userIngredients: isAuthenticated ? userIngredients : [],
    addUserIngredient: isAuthenticated ? addUserIngredientAction : undefined,
    deleteUserIngredient: isAuthenticated
      ? deleteUserIngredientAction
      : undefined,
    refreshUserIngredients: fetchUserIngredients,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
