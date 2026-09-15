@AGENTS.md

# Recipe Notebook

Застосунок для мами: зберігати домашні рецепти на телефоні. Одна користувачка.

## Ключова вимога
Дані живуть тільки в хмарі. Телефон/браузер нічого не зберігає локально —
зламався телефон, почистився браузер → рецепти на місці.

## Стек (вирішено)
- Next.js 16 (App Router, Server Actions, без окремого API) — читати `node_modules/next/dist/docs/` перед кодом
- Neon (Postgres) — дані і фото (`bytea`), free tier 0.5 GB
- Drizzle ORM + drizzle-kit — обрано свідомо, щоб не переписувати при розширенні
- Vercel — хостинг
- PWA manifest — іконка на екрані, повний екран
- shadcn/ui (base-nova, `src/components/ui` — не лінтимо), lucide-react; тема: primary = orange-500
- Textarea завжди `resize-none` (правка в `ui/textarea.tsx`)
- Тема: світла за замовчуванням, `.dark` на `<html>`; клієнтський `ThemeToggle` ставить клас + cookie `theme`, layout читає cookie для SSR. Без next-themes
- Вигляд списку (картки/рядки) — cookie `view`, server action `setView`
- npm

## Вхід
PIN-код з env-змінної → cookie на 365 днів. Вводиться один раз.
Біометрія = блокування телефону. WebAuthn НЕ робимо (можливий 2-й крок, окремий модуль).

## Рецепт
- title, category (обовʼязково, одразу), ingredients (текст), steps (текст), photo (одне, bytea), created_at
- Фото стискати на клієнті до ~200 KB (`canvas.toBlob`) перед відправкою
- Пошук: тільки по назві, `ILIKE`
- Інтерфейс українською

## Обовʼязкові функції
- CRUD рецептів
- Пошук по назві, фільтр по категорії
- Кнопка "Завантажити бекап" → ZIP з усіма рецептами і фото (страховка від самого Neon)

## Не робимо
- Google Drive як сховище
- NextAuth / повноцінний auth
- Кілька фото на рецепт
- Full-text search
- Окреме blob-сховище — `// ponytail: фото в bytea, Vercel Blob / R2 коли Neon >0.5 GB`
