"use client";

import { signOut } from "next-auth/react";
import { Button } from "../button";

const LogoutButton = () => {
  return (
    <Button onClick={() => signOut({ redirectTo: "/" })} variant="destructive">
      Log out
    </Button>
  );
};

export default LogoutButton;
