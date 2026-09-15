# Recipe Notebook

Домашні рецепти в хмарі. Next.js 16 + Neon + Drizzle, PWA.

## Запуск

```sh
cp .env.example .env.local   # вписати DATABASE_URL з Neon і свій PIN
npm i
npm run db:push              # створює таблицю recipes
npm run dev
```

## Деплой на Vercel

Env-змінні `DATABASE_URL` і `PIN` → Settings → Environment Variables. Далі `Додати на головний екран` у Chrome на телефоні.

## Бекап

Кнопка «Бекап» на головній → `recipes-YYYY-MM-DD.zip` (recipes.json + photos/).
