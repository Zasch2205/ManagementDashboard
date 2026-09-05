"use server";

import { signIn, signOut } from "@/auth";

export async function signInWithM365() {
  await signIn("microsoft-entra-id", { redirectTo: "/" });
}

export async function signOutFromM365() {
  await signOut({ redirectTo: "/" });
}
