"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { Button, buttonVariants } from "./button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { getCalmHover } from "@/lib/styles/calm-hover";

interface DebouncedLinkProps extends VariantProps<typeof buttonVariants> {
  href: string;
  children: React.ReactNode;
  className?: string;
  debounceMs?: number;
  hoverStyle?: "navigation" | "action" | "brand" | "secondary" | "none";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>; // Add this
}

export default function DebouncedLink({
  href,
  children,
  className,
  variant = "link",
  size,
  debounceMs = 600,
  hoverStyle = "navigation",
  onClick, // Add this
}: DebouncedLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  const debouncedNavigate = useMemo(
    () =>
      debounce((url: string) => {
        if (pathname !== url) {
          router.push(url);
        }
      }, debounceMs),
    [router, pathname, debounceMs]
  );

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      // Execute custom onClick first (if provided)
      if (onClick) {
        await onClick(e);
      }

      // Then navigate
      debouncedNavigate(href);
    },
    [href, debouncedNavigate, onClick]
  );

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        buttonVariants({ variant, size }),
        getCalmHover(hoverStyle),
        className
      )}
      onClick={handleClick}
      asChild={false}
    >
      {children}
    </Button>
  );
}
