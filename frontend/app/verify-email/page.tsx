"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

function VerifyEmailContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState(params.get("email") || "");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.verifyEmail({ email, token });
      toast.success("Email verified successfully. You can now log in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-6 rounded-xl border">
        <h1 className="text-2xl font-semibold">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit OTP sent to your email address.
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="6-digit OTP"
          maxLength={6}
          className="w-full px-3 py-2 border rounded-md tracking-[0.3em]"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-70"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center">Loading...</main>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
