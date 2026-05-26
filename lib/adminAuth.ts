import { cookies } from "next/headers";
import { createHash } from "crypto";

const SESSION_COOKIE = "kolkata_bus_admin";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD!;
}

function getSessionToken() {
  return createHash("sha256")
    .update(`kolkata-bus-admin:${getAdminPassword()}`)
    .digest("hex");
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === getSessionToken();
}

export async function createAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, getSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function isValidAdminPassword(password: string) {
  return password === getAdminPassword();
}
