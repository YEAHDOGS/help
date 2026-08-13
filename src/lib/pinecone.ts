import { Pinecone } from "@pinecone-database/pinecone";
import { integrations } from "@/lib/integrations";

const INDEX = process.env.PINECONE_INDEX ?? "dogs-help";

export function getPinecone(): Pinecone | null {
  if (!integrations.pinecone()) return null;
  return new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
}

/**
 * Semantic search over dog profiles using a Pinecone index with
 * integrated embeddings (create the index with an embedding model,
 * e.g. `llama-text-embed-v2`, and upsert records with a `text` field).
 */
export async function searchDogs(query: string, topK = 5) {
  const pc = getPinecone();
  if (!pc) return null;
  const index = pc.index(INDEX);
  const results = await index.searchRecords({
    query: { topK, inputs: { text: query } },
  });
  return results.result.hits.map((hit) => ({
    id: hit._id,
    score: hit._score,
    fields: hit.fields,
  }));
}
