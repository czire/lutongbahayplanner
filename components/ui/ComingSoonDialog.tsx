"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ComingSoonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  actionText?: string;
}

export default function ComingSoonDialog({
  isOpen,
  onClose,
  title = "🚧 Coming Soon!",
  description = `We're working hard to bring you this feature. For now, you can continue exploring the app as a guest or sign in with facebook/google. Your meal planning adventure awaits! 🍽️`,
  actionText = "Got it!",
}: ComingSoonDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>{actionText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for easy usage
export function useComingSoonDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const showDialog = () => setIsOpen(true);
  const hideDialog = () => setIsOpen(false);

  return {
    isOpen,
    showDialog,
    hideDialog,
    ComingSoonDialog: (
      props: Omit<ComingSoonDialogProps, "isOpen" | "onClose">
    ) => <ComingSoonDialog {...props} isOpen={isOpen} onClose={hideDialog} />,
  };
}
