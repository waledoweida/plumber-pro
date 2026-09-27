import { headers } from "next/headers";

export type Locale = "ar" | "en";

export async function getLocale(): Promise<Locale> {
  return (await headers()).get("x-locale") === "en" ? "en" : "ar";
}

export { isEnPath, altPath } from "./locale-client";
