export type BusDirection = "up" | "down";
export type BusType = "G" | "P";

export function normalizeStopName(stop: string) {
  return stop.trim().toLowerCase().replace(/\s+/g, "_");
}

export function displayStopName(stop: string) {
  return stop
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function parseStops(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).map(normalizeStopName).filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/\r?\n|,/)
    .map(normalizeStopName)
    .filter(Boolean);
}

export function cleanBusNumber(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

export function cleanDirection(value: unknown): BusDirection | null {
  return value === "up" || value === "down" ? value : null;
}

export function cleanBusType(value: unknown): BusType | null {
  if (value === "G" || value === "P") {
    return value;
  }

  if (value === "govt") {
    return "G";
  }

  if (value === "private") {
    return "P";
  }

  return null;
}
