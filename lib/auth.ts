"use client";

// Simple password-based authentication for admin panel
// Store password in environment variable: NEXT_PUBLIC_ADMIN_PASSWORD

export function checkAdminPassword(password: string): boolean {
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
  return password === adminPassword;
}

export function setAdminSession(): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("admin_authenticated", "true");
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("admin_authenticated") === "true";
  }
  return false;
}

export function clearAdminSession(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("admin_authenticated");
  }
}
