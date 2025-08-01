"use client";

import { signOut } from "next-auth/react";
import { Button } from "../button";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
}

const LogoutButton = ({
  variant = "destructive",
  size = "sm",
  className = "",
  showIcon = true,
}: LogoutButtonProps) => {
  return (
    <Button
      onClick={() => signOut({ redirectTo: "/" })}
      variant={variant}
      size={size}
      className={`bg-destructive ${className}`}
    >
      {showIcon && <LogOut size={16} className="mr-1" />}
      Log out
    </Button>
  );
};

export default LogoutButton;
