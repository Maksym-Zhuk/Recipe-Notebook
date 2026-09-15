import { and, desc, eq, ilike, sql } from "drizzle-orm";
import {
  LayoutGrid,
  Monitor,
  Moon,
  Plus,
  Rows3,
  Search,
  Sun,
} from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { setView } from "@/app/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/db";
import { recipes } from "@/db/schema";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { q, cat } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const category = typeof cat === "string" ? cat : "";
  const jar = await cookies();
  const view = jar.get("view")?.value === "list" ? "list" : "grid";
  const theme = jar.get("theme")?.value === "dark" ? "dark" : "light";

  const [list, cats] = await Promise.all([
    db
      .select({
        id: recipes.id,
        title: recipes.title,
        category: recipes.category,
        hasPhoto: sql<boolean>`${recipes.photo} is not null`,
        updatedAt: recipes.updatedAt,
      })
      .from(recipes)
      .where(
        and(
          query ? ilike(recipes.title, `%${query}%`) : undefined,
          category ? eq(recipes.category, category) : undefined,
        ),
      )
      .orderBy(desc(recipes.createdAt)),
    db
      .selectDistinct({ category: recipes.category })
      .from(recipes)
      .orderBy(recipes.category),
  ]);

  const chip = (label: string, value: string) => (
    <Badge
      key={value}
      variant={category === value ? "default" : "secondary"}
      className="shrink-0 px-4 py-4 text-base"
      render={
        <Link
          href={{
            pathname: "/",
            query: { ...(query && { q: query }), ...(value && { cat: value }) },
          }}
        />
      }
    >
      {label}
    </Badge>
  );

  return (
    <main className="flex flex-col gap-4 p-4 pb-28">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📖 Мої рецепти</h1>
        <div className="flex items-center gap-1">
          <ThemeToggle initial={theme} />
          <a
            href="/backup"
            className={buttonVariants({ variant: "link", size: "sm" })}
          >
            Бекап
          </a>
        </div>
      </header>

      <form className="flex gap-2">
        {category && <input type="hidden" name="cat" value={category} />}
        <Input
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Пошук за назвою…"
          className="h-12 text-lg md:text-lg"
        />
        <Button
          type="submit"
          size="icon-lg"
          className="size-12"
          aria-label="Шукати"
        >
          <Search />
        </Button>
      </form>

      <div className="-mx-4 flex gap-2 overflow-x-auto p-4">
        {chip("Усі", "")}
        {cats.map((c) => chip(c.category, c.category))}
      </div>

      {list.length === 0 && (
        <p className="py-16 text-center text-lg text-muted-foreground">
          Поки нічого нема. Додайте перший рецепт!
        </p>
      )}

      <ul
        className={
          view === "grid" ? "grid grid-cols-2 gap-3" : "flex flex-col gap-2"
        }
      >
        {list.map((r) => {
          const photo = r.hasPhoto ? (
            // biome-ignore lint/performance/noImgElement: dynamic bytea route, no optimizer needed
            <img
              src={`/recipes/${r.id}/photo?v=${r.updatedAt.getTime()}`}
              alt=""
              className={
                view === "grid"
                  ? "aspect-square w-full object-cover"
                  : "size-20 shrink-0 object-cover"
              }
              loading="lazy"
            />
          ) : (
            <div
              className={`flex items-center justify-center bg-primary/10 ${
                view === "grid"
                  ? "aspect-square text-5xl"
                  : "size-20 shrink-0 text-3xl"
              }`}
            >
              🍲
            </div>
          );
          return (
            <li key={r.id}>
              <Link href={`/recipes/${r.id}`}>
                <Card
                  className={`gap-0 overflow-hidden py-0 ${view === "list" ? "flex-row items-center" : ""}`}
                >
                  {photo}
                  <CardContent className="p-3">
                    <p className="line-clamp-2 font-semibold leading-tight">
                      {r.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {r.category}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>

      <Button
        size="icon-lg"
        className="fixed right-5 bottom-5 size-16 rounded-full shadow-lg [&_svg]:size-8"
        aria-label="Додати рецепт"
        nativeButton={false}
        render={<Link href="/recipes/new" />}
      >
        <Plus />
      </Button>
    </main>
  );
}
