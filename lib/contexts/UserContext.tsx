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

// Guest actions and utilities
import { generateGuestMealPlan } from "@/lib/actions/guest-actions";

// User actions
import {
  createUserMealPlan,
  getUserMealPlans,
  deleteUserMealPlan,
  addUserIngredient,
  getUserIngredients,
  deleteUserIngredient,
} from "@/lib/actions/user-actions";

// Storage utilities
import {
  getGeneratedMealPlanFromLocalStorage,
  saveGeneratedMealPlanToLocalStorage,
  clearGeneratedMealPlanFromLocalStorage,
} from "@/lib/utils/meal-plan-storage";

import type { User } from "next-auth";
import type { GuestSessionData, GuestMealPlan } from "@/lib/types/guest";
import type {
  UserMealPlan,
  UserIngredient,
  CreateUserMealPlanData,
  CreateUserIngredientData,
} from "@/lib/types/user";

// Guest limitations constants
const GUEST_LIMITATIONS = {
  MAX_GENERATIONS_PER_DAY: 3,
  MAX_MEAL_PLANS: 3,
};

// Guest session management
const GUEST_SESSION_KEY = "lutong-bahay-guest-session";

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

  // Separated meal plan operations
  savedMealPlans: UnifiedMealPlan[]; // Only saved plans from DB
  generatedMealPlans: UnifiedMealPlan[]; // Temporary/preview plans from localStorage
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

  // Generated recipes (extracted from meal plans)
  generatedRecipes: any[];

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

  // Guest session state (replacing useGuestSession)
  const [guestSession, setGuestSession] = useState<GuestSessionData | null>(
    null
  );
  const [isGuestLoading, setIsGuestLoading] = useState(true);

  // Determine user state
  const isAuthenticated = !!session?.user;
  const isGuest = !isAuthenticated && !!guestSession;
  const isLoading = status === "loading" || isGuestLoading;

  // User state
  const [savedUserMealPlans, setSavedUserMealPlans] = useState<UserMealPlan[]>(
    []
  );
  const [generatedUserMealPlans, setGeneratedUserMealPlans] = useState<
    UserMealPlan[]
  >([]);
  const [userIngredients, setUserIngredients] = useState<UserIngredient[]>([]);
  const [isLoadingMealPlans, setIsLoadingMealPlans] = useState(false);

  // Guest session management (replacing GuestSessionProvider functionality)
  useEffect(() => {
    const initializeGuestSession = () => {
      try {
        const stored = localStorage.getItem(GUEST_SESSION_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setGuestSession(parsed);
        } else if (!isAuthenticated) {
          // Create new guest session
          const newGuestSession: GuestSessionData = {
            id: `guest_${Date.now()}_${Math.random()
              .toString(36)
              .substring(2, 11)}`,
            role: "guest",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            mealPlans: [],
            userIngredients: [],
            savedRecipes: [],
            preferences: {},
            limitations: {
              generationsToday: 0,
              lastGenerationDate: new Date().toISOString(),
              maxGenerationsPerDay: GUEST_LIMITATIONS.MAX_GENERATIONS_PER_DAY,
              sessionStartTime: new Date().toISOString(),
            },
          };
          setGuestSession(newGuestSession);
          localStorage.setItem(
            GUEST_SESSION_KEY,
            JSON.stringify(newGuestSession)
          );
        }
      } catch (error) {
      } finally {
        setIsGuestLoading(false);
      }
    };

    initializeGuestSession();
  }, [isAuthenticated]);

  // Update guest session in localStorage
  const updateGuestSession = useCallback(
    (updates: Partial<GuestSessionData>) => {
      setGuestSession((prev) => {
        if (!prev) return null;
        const updated = {
          ...prev,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  // Fetch user data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserMealPlans();
      fetchUserIngredients();
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserMealPlans = useCallback(async () => {
    if (!isAuthenticated || !session?.user?.id) return;

    setIsLoadingMealPlans(true);
    try {
      // Fetch saved plans from DB
      const savedPlans = await getUserMealPlans();
      setSavedUserMealPlans(savedPlans);

      // Check if there's a generated meal plan in localStorage
      const generatedPlan = getGeneratedMealPlanFromLocalStorage(
        session.user.id
      );

      if (generatedPlan) {
        // Check if this generated plan is already saved in the DB
        const isSavedInDb = savedPlans.some(
          (dbPlan) => dbPlan.id === generatedPlan.id
        );

        if (isSavedInDb) {
          // The generated plan has been saved, clear it from localStorage
          clearGeneratedMealPlanFromLocalStorage(session.user.id);
          setGeneratedUserMealPlans([]);
        } else {
          // Keep the generated plan separate
          setGeneratedUserMealPlans([generatedPlan]);
        }
      } else {
        setGeneratedUserMealPlans([]);
      }
    } catch (error) {
    } finally {
      setIsLoadingMealPlans(false);
    }
  }, [isAuthenticated, session?.user?.id]);

  const fetchUserIngredients = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const ingredients = await getUserIngredients();
      setUserIngredients(ingredients);
    } catch (error) {}
  }, [isAuthenticated]);

  // Guest limitations (replacing useGuestLimitations)
  const getGuestLimitations = useCallback(() => {
    if (!guestSession || isAuthenticated) {
      return {
        canCreateMealPlan: false,
        generationsRemaining: 0,
        generationsUsedToday: 0,
        dailyGenerationLimitReached: false,
      };
    }

    const today = new Date().toDateString();
    const lastGenDate = guestSession.limitations?.lastGenerationDate
      ? new Date(guestSession.limitations.lastGenerationDate).toDateString()
      : null;
    const isNewDay = !lastGenDate || lastGenDate !== today;

    const generationsUsedToday = isNewDay
      ? 0
      : guestSession.limitations?.generationsToday || 0;
    const maxGenerations =
      guestSession.limitations?.maxGenerationsPerDay ||
      GUEST_LIMITATIONS.MAX_GENERATIONS_PER_DAY;
    const generationsRemaining = Math.max(
      0,
      maxGenerations - generationsUsedToday
    );
    const dailyGenerationLimitReached = generationsUsedToday >= maxGenerations;
    const canCreateMealPlan =
      !dailyGenerationLimitReached &&
      (guestSession.mealPlans?.length || 0) < GUEST_LIMITATIONS.MAX_MEAL_PLANS;

    return {
      canCreateMealPlan,
      generationsRemaining,
      generationsUsedToday,
      dailyGenerationLimitReached,
    };
  }, [guestSession, isAuthenticated]);

  const guestLimitations = getGuestLimitations();

  // Unified meal plan operations
  const createMealPlan = async (data: {
    budget: number;
    startDate?: string;
    endDate?: string;
  }): Promise<UnifiedMealPlan> => {
    if (isGuest && guestSession) {
      // Guest meal plan creation
      if (!guestLimitations.canCreateMealPlan) {
        throw new Error("Daily generation limit reached");
      }

      // Update generation count
      const today = new Date().toDateString();
      const lastGenDate = guestSession.limitations?.lastGenerationDate
        ? new Date(guestSession.limitations.lastGenerationDate).toDateString()
        : null;
      const isNewDay = !lastGenDate || lastGenDate !== today;
      const currentGenerations = isNewDay
        ? 0
        : guestSession.limitations?.generationsToday || 0;

      updateGuestSession({
        limitations: {
          ...guestSession.limitations,
          generationsToday: currentGenerations + 1,
          lastGenerationDate: new Date().toISOString(),
        },
      });

      // Generate guest meal plan
      const newGuestMealPlan = await generateGuestMealPlan(data.budget);

      // Clear existing meal plans (guests are limited to one)
      const updatedMealPlans = [newGuestMealPlan];
      updateGuestSession({
        mealPlans: updatedMealPlans,
      });

      return newGuestMealPlan as UnifiedMealPlan;
    } else if (isAuthenticated) {
      // User meal plan creation
      const startDate = data.startDate || new Date().toISOString();
      const endDate =
        data.endDate ||
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const userMealPlan = await createUserMealPlan({
        budget: data.budget,
        startDate,
        endDate,
      });

      // Save to localStorage as a generated/temporary plan (not to saved plans)
      setGeneratedUserMealPlans([userMealPlan]);
      saveGeneratedMealPlanToLocalStorage(userMealPlan);
      return userMealPlan as UnifiedMealPlan;
    }
    throw new Error("No valid session");
  };

  const deleteMealPlan = async (id: string): Promise<void> => {
    if (isGuest && guestSession) {
      const updatedMealPlans = guestSession.mealPlans.filter(
        (plan) => plan.id !== id
      );
      updateGuestSession({ mealPlans: updatedMealPlans });
    } else if (isAuthenticated) {
      // Check if it's a generated plan (temporary) or a saved plan
      const isGenerated = generatedUserMealPlans.some((plan) => plan.id === id);

      if (isGenerated) {
        // Remove from generated plans and localStorage
        setGeneratedUserMealPlans((prev) =>
          prev.filter((plan) => plan.id !== id)
        );
        if (session?.user?.id) {
          clearGeneratedMealPlanFromLocalStorage(session.user.id);
        }
      } else {
        // Remove from saved plans and database
        await deleteUserMealPlan(id);
        setSavedUserMealPlans((prev) => prev.filter((plan) => plan.id !== id));
      }
    }
  };

  const refreshMealPlans = async (): Promise<void> => {
    if (isGuest) {
      // Guest meal plans are in state, no need to refresh
    } else if (isAuthenticated) {
      await fetchUserMealPlans();
    }
  };

  // User ingredient operations
  const addUserIngredientAction = async (
    ingredient: CreateUserIngredientData
  ): Promise<UserIngredient> => {
    if (!isAuthenticated) {
      throw new Error("Only authenticated users can add ingredients");
    }

    const newIngredient = await addUserIngredient(ingredient);
    setUserIngredients((prev) => [newIngredient, ...prev]);
    return newIngredient;
  };

  const deleteUserIngredientAction = async (id: string): Promise<void> => {
    if (!isAuthenticated) return;

    await deleteUserIngredient(id);
    setUserIngredients((prev) =>
      prev.filter((ingredient) => ingredient.id !== id)
    );
  };

  const value: UserContextType = {
    // User identification
    user: session?.user || null,
    guestSession,
    isAuthenticated,
    isGuest,
    isLoading,

    // Separated meal plans
    savedMealPlans: isGuest ? [] : savedUserMealPlans,
    generatedMealPlans: isGuest
      ? guestSession?.mealPlans || []
      : generatedUserMealPlans,
    createMealPlan,
    deleteMealPlan,
    refreshMealPlans,
    isLoadingMealPlans: isGuest ? false : isLoadingMealPlans,

    // Limitations (guests only)
    canCreateMealPlan: isGuest ? guestLimitations.canCreateMealPlan : true,
    generationsRemaining: isGuest
      ? guestLimitations.generationsRemaining
      : Infinity,
    generationsUsedToday: isGuest ? guestLimitations.generationsUsedToday : 0,
    dailyGenerationLimitReached: isGuest
      ? guestLimitations.dailyGenerationLimitReached
      : false,

    // Generated recipes (extracted from all meal plans, deduplicated by ID)
    generatedRecipes: Array.from(
      new Map(
        (isGuest
          ? guestSession?.mealPlans || []
          : [...savedUserMealPlans, ...generatedUserMealPlans]
        )
          .flatMap((plan) =>
            plan.meals
              .map((meal) => meal.recipe)
              .filter(
                (recipe): recipe is NonNullable<typeof recipe> =>
                  recipe != null && recipe.id != null
              )
          )
          .map((recipe) => [recipe.id, recipe])
      ).values()
    ),

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
