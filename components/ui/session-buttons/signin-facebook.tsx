"use client";

import { signIn } from "next-auth/react";
import { Button } from "../button";

const SignInFacebook = () => {
  return (
    <form
      action={() => signIn("facebook", { redirectTo: "/example/meal-planner" })}
    >
      <Button type="submit">Sign in with Facebook</Button>
    </form>
  );
};

export default SignInFacebook;
