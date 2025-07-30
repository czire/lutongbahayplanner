"use client";

import { Button } from "@/components/ui/button";
import SignInFacebook from "@/components/ui/session-buttons/signin-facebook";
import SignInGoogle from "@/components/ui/session-buttons/signin-google";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGuestLogin = () => {
    // Implement guest login logic here
    console.log("Guest login initiated");
    router.push("/example/meal-planner");
  };

  return (
    <main>
      {/* Uncomment the following lines to enable sign-in buttons */}
      <SignInFacebook />
      <SignInGoogle />
      <Button onClick={handleGuestLogin}>Login as Guest</Button>
    </main>
  );
}
