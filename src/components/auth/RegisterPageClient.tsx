"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerAction } from "@/lib/actions/auth";
import { RegisterForm } from "@/components/auth/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RegisterPageClient() {
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
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      </CardContent>
    </Card>
  );
}
