import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Recipe Notebook",
  description: "Мої домашні рецепти",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Рецепти" },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const dark = (await cookies()).get("theme")?.value === "dark";
  return (
    <html lang="uk" className={cn("font-sans", geist.variable, dark && "dark")}>
      <body className="mx-auto min-h-dvh max-w-2xl antialiased">
        {children}
      </body>
    </html>
  );
}
