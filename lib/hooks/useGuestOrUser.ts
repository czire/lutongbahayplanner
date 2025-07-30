"use client";

import { useSession } from "next-auth/react";

type UseGuestOrUserReturnType = {
  user: any; // Replace 'any' with your user type
  isGuest: boolean;
  status: "loading" | "authenticated" | "unauthenticated";
};

export const useGuestOrUser = (): UseGuestOrUserReturnType => {
  const { data: session, status } = useSession();
  const isGuest = !session?.user;

  return {
    user: session?.user,
    isGuest,
    status,
  };
};
