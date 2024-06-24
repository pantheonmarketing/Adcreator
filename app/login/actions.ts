"use server";

export async function authenticate(_currentState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log({
      email,
      password,
    });
    return true;
  } catch (error: any) {
    console.error("[login] error:", error);
    throw error;
  }
}
