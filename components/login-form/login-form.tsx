"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";

// Define a type for form values
interface FormValues {
  email: string;
  password: string;
}

export function LoginForm({
  login,
  signup,
}: {
  login: (formData: FormData) => void;
  signup: (formData: FormData) => void;
}) {
  const [isSignup, setIsSignup] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Define onSubmit with proper type
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    if (isSignup) {
      await signup(formData);
    } else {
      await login(formData);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 p-4 sm:p-6 justify-center items-center")}>
      <Card className="overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow w-full">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 sm:p-8 flex flex-col gap-6"
          >
            <div className="text-center md:text-left">
              <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                {isSignup ? "Sign Up" : "Welcome Back"}
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400 sm:mt-3">
                {isSignup
                  ? "Create your Acme Inc account"
                  : "Login to your Acme Inc account"}
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...form.register("email", { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-800 dark:text-gray-200">
                    Password
                  </Label>
                  {!isSignup && (
                    <a
                      href="#"
                      className="text-sm text-blue-600 dark:text-blue-400 underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password", { required: true })}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSignup ? "Sign Up" : "Login"}
            </Button>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              {isSignup
                ? "Already have an account? "
                : "Don't have an account? "}
              <Button
                variant="link"
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-blue-600 dark:text-blue-400"
              >
                {isSignup ? "Log In" : "Sign Up"}
              </Button>
            </div>
          </form>
          <div className="hidden md:block relative">
            <Image
              src="/dr.jpg"
              alt="Doctor illustration"
              className="absolute inset-0 w-full h-full object-cover"
              width={1000}
              height={1000}
              priority
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline text-blue-600 dark:text-blue-400">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline text-blue-600 dark:text-blue-400">
          Privacy Policy
        </a>.
      </div>
    </div>
  );
}
