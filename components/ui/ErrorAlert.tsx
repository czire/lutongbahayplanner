"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Info } from "lucide-react";

interface ErrorAlertProps {
  className?: string;
}

export function ErrorAlert({ className }: ErrorAlertProps) {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const messageParam = searchParams.get("message");

    if (errorParam && messageParam) {
      setError(errorParam);
      setMessage(messageParam);
      setIsVisible(true);

      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const getErrorIcon = (errorType: string) => {
    switch (errorType) {
      case "guest-restricted":
      case "auth-required":
        return <AlertTriangle className="h-4 w-4" />;
      case "meal-plan-not-found":
        return <Info className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getErrorVariant = (errorType: string): "default" | "destructive" => {
    switch (errorType) {
      case "guest-restricted":
        return "default";
      case "auth-required":
      case "meal-plan-not-found":
        return "destructive";
      default:
        return "destructive";
    }
  };

  if (!isVisible || !error || !message) {
    return null;
  }

  return (
    <Alert variant={getErrorVariant(error)} className={`relative ${className}`}>
      {getErrorIcon(error)}
      <AlertDescription className="pr-8">{message}</AlertDescription>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-transparent"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </Alert>
  );
}
