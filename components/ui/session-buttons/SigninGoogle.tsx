"use client";

import { signIn } from "next-auth/react";
import { Button } from "../button";

const SignInGoogle = () => {
  return (
    <form
      action={() => signIn("google", { redirectTo: "/example/meal-planner" })}
    >
      <Button type="submit">Sign in with Google</Button>
    </form>
  );
};

export default SignInGoogle;
