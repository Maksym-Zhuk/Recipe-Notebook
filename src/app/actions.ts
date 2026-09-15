"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { recipes } from "@/db/schema";
import { PIN_COOKIE, pinHash } from "@/lib/auth";

export async function login(formData: FormData) {
  if (formData.get("pin") !== process.env.PIN) {
    await new Promise((r) => setTimeout(r, 500)); // ponytail: затримка замість rate limit
    redirect("/login?error=1");
  }
  (await cookies()).set(PIN_COOKIE, await pinHash(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect("/");
}

export async function saveRecipe(id: number | null, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  if (!title || !category) throw new Error("Назва і категорія обовʼязкові");

  const photoFile = formData.get("photo");
  const photo =
    photoFile instanceof File && photoFile.size > 0
      ? Buffer.from(await photoFile.arrayBuffer())
      : undefined;

  const values = {
    title,
    category,
    ingredients: String(formData.get("ingredients") ?? ""),
    steps: String(formData.get("steps") ?? ""),
    ...(photo && { photo }),
    updatedAt: new Date(),
  };

  let recipeId = id;
  if (id === null) {
    [{ id: recipeId }] = await db
      .insert(recipes)
      .values(values)
      .returning({ id: recipes.id });
  } else {
    await db.update(recipes).set(values).where(eq(recipes.id, id));
  }

  revalidatePath("/");
  redirect(`/recipes/${recipeId}`);
}

export async function deleteRecipe(id: number) {
  await db.delete(recipes).where(eq(recipes.id, id));
  revalidatePath("/");
  redirect("/");
}

export async function setView(view: "grid" | "list") {
  (await cookies()).set("view", view, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath("/");
}
