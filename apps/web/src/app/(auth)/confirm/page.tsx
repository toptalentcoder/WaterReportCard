// app/(auth)/confirm/page.js
import { Suspense } from "react";
import ConfirmPageClient from "./ConfirmPageClient";

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <ConfirmPageClient />
    </Suspense>
  );
}
