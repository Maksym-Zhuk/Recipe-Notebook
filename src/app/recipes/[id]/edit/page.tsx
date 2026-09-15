import { eq, sql } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { saveRecipe } from "@/app/actions";
import { RecipeForm } from "@/components/recipe-form";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { recipes } from "@/db/schema";

export default async function EditRecipe({
  params,
}: PageProps<"/recipes/[id]/edit">) {
  const { id } = await params;
  const [[r], cats] = await Promise.all([
    db
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
      .where(eq(recipes.id, Number(id))),
    db.selectDistinct({ category: recipes.category }).from(recipes),
  ]);
  if (!r) notFound();

  return (
    <main className="flex flex-col gap-4 p-4 pb-12">
      <Button
        variant="ghost"
        className="self-start"
        nativeButton={false}
        render={<Link href={`/recipes/${r.id}`} />}
      >
        <ArrowLeft /> Назад
      </Button>
      <h1 className="text-2xl font-bold">Редагувати</h1>
      <RecipeForm
        action={saveRecipe.bind(null, r.id)}
        categories={cats.map((c) => c.category)}
        initial={{
          ...r,
          photoUrl: r.hasPhoto
            ? `/recipes/${r.id}/photo?v=${r.updatedAt.getTime()}`
            : undefined,
        }}
      />
    </main>
  );
}
