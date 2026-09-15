import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { saveRecipe } from "@/app/actions";
import { RecipeForm } from "@/components/recipe-form";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { recipes } from "@/db/schema";

export const dynamic = "force-dynamic"; // категорії читаються з БД на кожен запит

export default async function NewRecipe() {
  const cats = await db
    .selectDistinct({ category: recipes.category })
    .from(recipes);
  return (
    <main className="flex flex-col gap-4 p-4 pb-12">
      <Button
        variant="ghost"
        className="self-start"
        nativeButton={false}
        render={<Link href="/" />}
      >
        <ArrowLeft /> Назад
      </Button>
      <h1 className="text-2xl font-bold">Новий рецепт</h1>
      <RecipeForm
        action={saveRecipe.bind(null, null)}
        categories={cats.map((c) => c.category)}
      />
    </main>
  );
}
