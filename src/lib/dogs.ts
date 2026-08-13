import { getSupabase } from "@/lib/supabase";

export type Dog = {
  id: string;
  name: string;
  breed: string;
  age_years: number;
  story: string;
  goal_usd: number;
  raised_usd: number;
  image_url: string;
};

/** Sample data shown until Supabase is connected and seeded. */
export const sampleDogs: Dog[] = [
  {
    id: "sample-biscuit",
    name: "Biscuit",
    breed: "Golden Retriever mix",
    age_years: 3,
    story:
      "Found wandering a highway rest stop, Biscuit needs surgery on his back leg before he can run again.",
    goal_usd: 2400,
    raised_usd: 1650,
    image_url:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80",
  },
  {
    id: "sample-luna",
    name: "Luna",
    breed: "Husky",
    age_years: 5,
    story:
      "Surrendered when her family moved, Luna is heartworm-positive and partway through treatment.",
    goal_usd: 1200,
    raised_usd: 480,
    image_url:
      "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&q=80",
  },
  {
    id: "sample-pepper",
    name: "Pepper",
    breed: "Border Collie",
    age_years: 1,
    story:
      "A puppy-mill rescue learning that people can be kind. Pepper needs vaccinations and a behaviorist.",
    goal_usd: 900,
    raised_usd: 720,
    image_url:
      "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=800&q=80",
  },
];

/** Dogs from Supabase when configured, sample data otherwise. */
export async function listDogs(): Promise<{ dogs: Dog[]; live: boolean }> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("dogs")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return { dogs: data as Dog[], live: true };
    }
  }
  return { dogs: sampleDogs, live: false };
}
