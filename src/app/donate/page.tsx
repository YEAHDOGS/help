import { Suspense } from "react";
import { DonateForm } from "./donate-form";

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-center text-4xl font-extrabold tracking-tight">
        Give a dog a second chance
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-center text-amber-950/70">
        Your donation covers food, vaccinations, surgery, and shelter for
        rescue dogs.
      </p>
      <div className="mt-10">
        <Suspense>
          <DonateForm />
        </Suspense>
      </div>
    </div>
  );
}
