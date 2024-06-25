"use server";

export async function submission(formData: FormData): Promise<void> {
  console.log("[contact] submission:", Object.fromEntries(formData));
}
