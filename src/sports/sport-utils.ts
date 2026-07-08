import type { Sport } from "./sport.js";

export function isMmaSport(sport: Sport): boolean {
  return sport.name.toLowerCase().includes("mma") || sport.name.toLowerCase().includes("combat");
}
