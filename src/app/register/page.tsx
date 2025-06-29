"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { RegisterForm } from "@/components/auth/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationCode, setRegistrationCode] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setRegistrationCode(code);
    }
  }, [searchParams]);

  const handleRegister = async (data: {
    email: string;
    name: string;
    password: string;
    registrationCode: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await registerAction(data);

      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">NexLock Admin</h1>
          <p className="mt-2 text-gray-600">Create your admin account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Complete your admin registration using your registration code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={isLoading}
              error={error}
              initialRegistrationCode={registrationCode}
            />

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
