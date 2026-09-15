import { eq, sql } from "drizzle-orm";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { recipes } from "@/db/schema";

export default async function RecipePage({
  params,
}: PageProps<"/recipes/[id]">) {
  const { id } = await params;
  const [r] = await db
    .select({
      id: recipes.id,
      title: recipes.title,
      category: recipes.category,
      ingredients: recipes.ingredients,
      steps: recipes.steps,
      hasPhoto: sql<boolean>`${recipes.photo} is not null`,
      updatedAt: recipes.updatedAt,
    })
    .from(recipes)
    .where(eq(recipes.id, Number(id)));
  if (!r) notFound();

  return (
    <main className="flex flex-col gap-5 p-4 pb-12">
      <nav className="flex items-center justify-between">
        <Button variant="ghost" nativeButton={false} render={<Link href="/" />}>
          <ArrowLeft /> Назад
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/recipes/${r.id}/edit`} />}
          >
            <Pencil /> Редагувати
          </Button>
          <DeleteButton id={r.id} />
        </div>
      </nav>

      {r.hasPhoto && (
        // biome-ignore lint/performance/noImgElement: dynamic bytea route
        <img
          src={`/recipes/${r.id}/photo?v=${r.updatedAt.getTime()}`}
          alt={r.title}
          className="w-full rounded-xl object-cover"
        />
      )}

      <div className="flex flex-col items-start gap-2">
        <Badge variant="secondary">{r.category}</Badge>
        <h1 className="text-3xl font-bold">{r.title}</h1>
      </div>

      {r.ingredients && (
        <section>
          <h2 className="mb-2 text-xl font-semibold">Інгредієнти</h2>
          <p className="whitespace-pre-line text-lg leading-relaxed">
            {r.ingredients}
          </p>
        </section>
      )}

      {r.steps && (
        <section>
          <h2 className="mb-2 text-xl font-semibold">Приготування</h2>
          <p className="whitespace-pre-line text-lg leading-relaxed">
            {r.steps}
          </p>
        </section>
      )}
    </main>
  );
}
