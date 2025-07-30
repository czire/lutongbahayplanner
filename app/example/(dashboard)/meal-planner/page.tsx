"use client";

import LogoutButton from "@/components/ui/session-buttons/LogoutButton";
import { useGuestOrUser } from "@/lib/hooks/useGuestOrUser";

const Page = () => {
  const { isGuest, user, status } = useGuestOrUser();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Meal Planner Page</h1>
      {isGuest && <p>You are viewing this as a guest.</p>}
      {!isGuest && <p>Welcome back, {user?.name || user?.email}!</p>}
      {/* Additional content for the meal planner can go here */}
      <LogoutButton />
    </div>
  );
};

export default Page;
