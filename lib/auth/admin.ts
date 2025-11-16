import { auth } from "@/lib/firebase/config";
import { User } from "firebase/auth";

// Admin email list
const ADMIN_EMAILS = ["admin@system.com"];

export async function isAdmin(user: User | null): Promise<boolean> {
  if (!user || !auth) return false;

  try {
    // Check custom claims first
    const token = await user.getIdTokenResult();
    if (token.claims.admin === true) {
      return true;
    }

    // Check email list
    if (user.email && ADMIN_EMAILS.includes(user.email)) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export function checkAdminSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("isAdmin") === "true";
}

export function getCurrentUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("userEmail");
}
