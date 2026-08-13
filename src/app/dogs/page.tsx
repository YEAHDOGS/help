import Image from "next/image";
import Link from "next/link";
import { listDogs } from "@/lib/dogs";

export const dynamic = "force-dynamic";

export default async function DogsPage() {
  const { dogs, live } = await listDogs();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight">
        Dogs who need you
      </h1>
      <p className="mt-3 text-amber-950/70">
        {live
          ? "Live from Supabase."
          : "Sample dogs — connect Supabase and run the migration to manage real profiles."}
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {dogs.map((dog) => {
          const pct = Math.min(
            100,
            Math.round((dog.raised_usd / dog.goal_usd) * 100)
          );
          return (
            <div
              key={dog.id}
              className="overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-sm"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={dog.image_url}
                  alt={dog.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-xl font-bold">{dog.name}</h2>
                  <span className="text-sm text-amber-950/60">
                    {dog.breed} · {dog.age_years}y
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-amber-950/70">
                  {dog.story}
                </p>
                <div className="mt-4">
                  <div className="h-2 rounded-full bg-amber-100">
                    <div
                      className="h-2 rounded-full bg-amber-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="font-semibold text-amber-800">
                      ${dog.raised_usd.toLocaleString()} raised
                    </span>
                    <span className="text-amber-950/60">
                      of ${dog.goal_usd.toLocaleString()}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/donate?dog=${encodeURIComponent(dog.id)}&name=${encodeURIComponent(dog.name)}`}
                  className="mt-4 block rounded-full bg-amber-700 py-2 text-center font-semibold text-white hover:bg-amber-800"
                >
                  Help {dog.name}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
