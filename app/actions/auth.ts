"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function sendMagicLink(email: string, failurePath: string, sentPath: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    redirect(`${failurePath}?message=Could not send sign-in link`);
  }

  redirect(`${sentPath}?sent=1`);
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;

  await sendMagicLink(email, "/auth/login", "/auth/login");
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;

  await sendMagicLink(email, "/auth/signup", "/auth/signup");
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/auth/login");
}
