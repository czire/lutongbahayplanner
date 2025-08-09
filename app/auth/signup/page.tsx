"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/Logo";
import SigninGoogle from "@/components/ui/session-buttons/SigninGoogle";
import SigninFacebook from "@/components/ui/session-buttons/SigninFacebook";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// Validation schema
const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "At least 2 characters")
      .max(50, "Max 50 characters"),
    email: z.email("Invalid email").min(1, "Email is required"),
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupValues = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const autoLoginAfterSignup = true; // toggle if desired

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: SignupValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          name: values.name,
          password: values.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = data.message || "Failed to sign up";
        if (message.toLowerCase().includes("already")) {
          form.setError("email", { type: "manual", message });
        } else {
          toast.error(message);
        }
        throw new Error(message);
      }

      toast.success(
        "Account created" +
          (autoLoginAfterSignup
            ? ", signing you in..."
            : ". You can sign in now.")
      );

      if (autoLoginAfterSignup) {
        const loginRes = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });
        if (loginRes?.error) {
          toast.error("Auto sign-in failed. Please login manually.");
          router.push("/auth/login");
          return;
        }
        router.push("/meal-planner/plans");
      } else {
        router.push("/auth/login");
      }
    } catch (err) {
      // errors already handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Create your account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Juan Dela Cruz"
                          autoComplete="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Repeat password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !form.formState.isValid}
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </form>
            </Form>
            <div className="relative text-center">
              <span className="text-xs text-gray-500">OR CONTINUE WITH</span>
            </div>
            <div className="space-y-3 flex-center flex-col">
              <SigninGoogle />
              <SigninFacebook />
            </div>
            <div className="text-xs text-center text-gray-500">
              By continuing you accept our terms.
            </div>
            <div className="text-center text-sm">
              <Link href="/auth/login" className="text-primary hover:underline">
                Already have an account? Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
