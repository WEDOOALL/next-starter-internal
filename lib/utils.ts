import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn` — class-name merger compatible with Tailwind v4 + shadcn/ui v4.
 *
 * Example:
 *   <div className={cn("p-4", isActive && "bg-accent", "p-6")} />
 *   → "bg-accent p-6" (later p-6 wins via tailwind-merge, isActive applied)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
