"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const TOKEN_KEY = "procureos_token";
const USER_KEY = "procureos_user";

export function setSession(data) {
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  if (typeof window === "undefined") {
    return null;
  }
  const value = localStorage.getItem(USER_KEY);
  return value ? JSON.parse(value) : null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function useProtectedRoute() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    }
  }, [router]);
}
