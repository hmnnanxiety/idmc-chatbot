import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Compose conditional utilities without conflicting Tailwind declarations. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
