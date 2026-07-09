export function formatDate(date: string): string {
  const parsed = new Date(date);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}
