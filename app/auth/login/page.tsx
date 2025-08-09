"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
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
import { useRouter } from "next/navigation";

// Validation schema
const loginSchema = z.object({
  email: z.email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "At least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });
  const router = useRouter();

  const onSubmit = async (values: LoginValues) => {
    setLoading(true);
    const { email, password } = values;
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.error) {
        if (res.error.includes("social")) {
          form.setError("email", { type: "manual", message: res.error });
        } else {
          form.setError("password", {
            type: "manual",
            message: "Invalid credentials",
          });
        }
        return;
      }
      router.push("/meal-planner/plans");
    } catch (e: any) {
      form.setError("email", {
        type: "manual",
        message: e.message || "Login failed",
      });
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
              Sign In / Create Account
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
                          autoComplete="current-password"
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
                  {loading ? "Signing in..." : "Sign In"}
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
              <Link
                href="/auth/signup"
                className="text-primary hover:underline"
              >
                Need an account? Sign up
              </Link>
            </div>
            <div className="text-center text-sm">
              <Link href="/" className="text-primary/70 hover:underline">
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
