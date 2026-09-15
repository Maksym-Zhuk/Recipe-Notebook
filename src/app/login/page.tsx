import { login } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function Login({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">📖 Recipe Notebook</h1>
      <form action={login} className="flex w-full max-w-xs flex-col gap-4">
        <Input
          name="pin"
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          placeholder="PIN-код"
          required
          className="h-14 text-center text-2xl tracking-widest md:text-2xl"
        />
        {error && (
          <p className="text-center text-destructive">Неправильний PIN</p>
        )}
        <Button type="submit" size="lg" className="h-14 text-lg">
          Увійти
        </Button>
      </form>
    </main>
  );
}
