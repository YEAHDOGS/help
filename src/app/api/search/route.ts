import { NextRequest, NextResponse } from "next/server";
import { searchDogs } from "@/lib/pinecone";
import { sampleDogs } from "@/lib/dogs";
import { checkRateLimit } from "@/lib/ratelimit";

/**
 * GET /api/search?q=...
 * Semantic search over dog profiles via Pinecone. Falls back to a simple
 * keyword match over sample data until Pinecone is configured.
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
  if (!(await checkRateLimit(`search:${ip}`))) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ error: "Missing ?q= query." }, { status: 400 });
  }

  const hits = await searchDogs(q).catch(() => null);
  if (hits) {
    return NextResponse.json({ source: "pinecone", hits });
  }

  const needle = q.toLowerCase();
  const matches = sampleDogs.filter((dog) =>
    [dog.name, dog.breed, dog.story].join(" ").toLowerCase().includes(needle)
  );
  return NextResponse.json({ source: "sample", hits: matches });
}
