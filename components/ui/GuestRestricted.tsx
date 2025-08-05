import { useGuestOrUser } from "@/lib/hooks/useGuestOrUser";

interface GuestRestrictedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showForGuests?: boolean; // If true, show for guests but hide for non-authenticated users
}

/**
 * Component that conditionally renders content based on user authentication status
 * By default, hides content for guests and shows for authenticated users
 */
export function GuestRestricted({
  children,
  fallback = null,
  showForGuests = false,
}: GuestRestrictedProps) {
  const { isAuthenticated, isGuest, isLoading } = useGuestOrUser();

  // Don't render anything while loading
  if (isLoading) {
    return null;
  }

  // Show for authenticated users
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show for guests if explicitly allowed
  if (isGuest && showForGuests) {
    return <>{children}</>;
  }

  // Show fallback for everyone else
  return <>{fallback}</>;
}

interface AuthOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that only shows content for authenticated users
 * Hides content for both guests and non-authenticated users
 */
export function AuthOnly({ children, fallback = null }: AuthOnlyProps) {
  const { isAuthenticated, isLoading } = useGuestOrUser();

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
}

interface GuestOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that only shows content for guests
 * Hides content for authenticated users and non-authenticated users
 */
export function GuestOnly({ children, fallback = null }: GuestOnlyProps) {
  const { isGuest, isLoading } = useGuestOrUser();

  if (isLoading) {
    return null;
  }

  return isGuest ? <>{children}</> : <>{fallback}</>;
}
