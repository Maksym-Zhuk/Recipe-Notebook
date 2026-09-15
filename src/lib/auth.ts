export const PIN_COOKIE = "pin";

// cookie carries sha256(PIN), not the PIN itself
export async function pinHash() {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${process.env.PIN}:recipe-notebook`),
  );
  return Array.from(new Uint8Array(buf), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
