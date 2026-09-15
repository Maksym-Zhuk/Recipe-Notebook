import { strToU8, zipSync } from "fflate";
import { db } from "@/db";
import { recipes } from "@/db/schema";

export const dynamic = "force-dynamic";

// ponytail: весь бекап у памʼяті — ок поки Neon free tier (<0.5 GB)
export async function GET() {
  const all = await db.select().from(recipes);
  const files: Record<string, Uint8Array | [Uint8Array, { level: 0 }]> = {
    "recipes.json": strToU8(
      JSON.stringify(
        all.map(({ photo, ...r }) => ({
          ...r,
          photo: photo ? `photos/${r.id}.jpg` : null,
        })),
        null,
        2,
      ),
    ),
  };
  for (const r of all)
    if (r.photo)
      files[`photos/${r.id}.jpg`] = [new Uint8Array(r.photo), { level: 0 }];

  const date = new Date().toISOString().slice(0, 10);
  return new Response(new Uint8Array(zipSync(files)), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="recipes-${date}.zip"`,
    },
  });
}
