import { eq } from "drizzle-orm";
import { db } from "@/db";
import { recipes } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/recipes/[id]/photo">,
) {
  const { id } = await ctx.params;
  const [r] = await db
    .select({ photo: recipes.photo })
    .from(recipes)
    .where(eq(recipes.id, Number(id)));
  if (!r?.photo) return new Response(null, { status: 404 });
  // URL carries ?v=updatedAt, so the bytes at this URL never change
  return new Response(new Uint8Array(r.photo), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "private, max-age=31536000, immutable",
    },
  });
}
