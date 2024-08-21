import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatToTimeAgo(date: string): string {
  if (!date) return "";
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);
  const formatter = new Intl.RelativeTimeFormat("ko");
  return formatter.format(diff, "days");
}

export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isPastEndDate(endDate: Date): boolean {
  const now = convertUTCToLocalTime();
  return now > endDate;
}

export function convertUTCToLocalTime() {
  const utcDate = new Date();
  const nineHoursInMillis = 9 * 60 * 60 * 1000;
  const localDate = new Date(utcDate.getTime() + nineHoursInMillis);

  return localDate;
}
