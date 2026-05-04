"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { paymentService } from "@/services/payment.service";
import { toast } from "sonner";

function PaymentVerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const reference = useMemo(() => searchParams.get("reference"), [searchParams]);

  useEffect(() => {
    const verify = async () => {
      if (!reference) {
        setStatus("failed");
        return;
      }
      try {
        await paymentService.verify(reference);
        setStatus("success");
        toast.success("Payment verified successfully.");
      } catch (error: any) {
        setStatus("failed");
        toast.error(error?.response?.data?.message || "Payment verification failed");
      }
    };
    verify();
  }, [reference]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 border rounded-xl space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Payment Verification</h1>
        {status === "loading" && <p>Verifying your payment...</p>}
        {status === "success" && <p>Your payment was successful and has been confirmed.</p>}
        {status === "failed" && <p>We could not verify this payment. Please contact support.</p>}
        <button
          onClick={() => router.push("/dashboard/buyer")}
          className="w-full py-2 rounded-md bg-primary text-primary-foreground"
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center">Loading...</main>}>
      <PaymentVerifyContent />
    </Suspense>
  );
}
