"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  action: (formData: FormData) => Promise<void>;
  categories: string[];
  initial?: {
    title: string;
    category: string;
    ingredients: string;
    steps: string;
    photoUrl?: string;
  };
};

// стискаємо на телефоні до ~200 KB, щоб Neon free tier вистачило на роки
async function compress(file: File): Promise<File> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")?.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) =>
    canvas.toBlob(r, "image/jpeg", 0.8),
  );
  return new File([blob ?? file], "photo.jpg", { type: "image/jpeg" });
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="h-14 text-lg">
      {pending ? "Зберігаю…" : "Зберегти"}
    </Button>
  );
}

const big = "h-12 bg-card text-lg md:text-lg";
const area =
  "min-h-40 border-2 border-input bg-card p-3 text-lg leading-relaxed md:text-lg";

export function RecipeForm({ action, categories, initial }: Props) {
  const [preview, setPreview] = useState(initial?.photoUrl);

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const small = await compress(file);
    const dt = new DataTransfer();
    dt.items.add(small);
    e.target.files = dt.files;
    setPreview(URL.createObjectURL(small));
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title" className="text-base">
          Назва
        </Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={initial?.title}
          className={big}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="category" className="text-base">
          Категорія
        </Label>
        <Input
          id="category"
          name="category"
          required
          list="categories"
          defaultValue={initial?.category}
          className={big}
        />
        <datalist id="categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="photo" className="text-base">
          Фото
        </Label>
        {preview && (
          // biome-ignore lint/performance/noImgElement: local preview
          <img
            src={preview}
            alt=""
            className="w-full rounded-xl object-cover"
          />
        )}
        <Input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          onChange={onPhoto}
          className="h-12 bg-card pt-2.5 text-base"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ingredients" className="text-base">
          Інгредієнти
        </Label>
        <Textarea
          id="ingredients"
          name="ingredients"
          rows={8}
          defaultValue={initial?.ingredients}
          placeholder={
            "Кожен з нового рядка:\nБорошно — 2 склянки\nЯйця — 3 шт"
          }
          className={area}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="steps" className="text-base">
          Приготування
        </Label>
        <Textarea
          id="steps"
          name="steps"
          rows={14}
          defaultValue={initial?.steps}
          className={area}
        />
      </div>

      <SubmitButton />
    </form>
  );
}
