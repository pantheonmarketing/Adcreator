"use server";

export async function actionSubmission(prevState: any, formData: FormData) {
  const submission = {
    email: formData.get("email"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    comments: formData.get("comments"),
  };
  console.log("[contact] submission:", Object.fromEntries(formData));
  return {
    success: "Thank you for your submission!",
  };
}
