"use client";

import { Trash2 } from "lucide-react";
import { deleteRecipe } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function DeleteButton({ id }: { id: number }) {
  return (
    <form
      action={deleteRecipe.bind(null, id)}
      onSubmit={(e) => confirm("Видалити рецепт?") || e.preventDefault()}
    >
      <Button type="submit" variant="destructive" aria-label="Видалити">
        <Trash2 />
      </Button>
    </form>
  );
}
