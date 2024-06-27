import { ContactPage } from "./ContactPage";

export default async function Contact() {
  const data = await ContactPage.load();
  const blocks = await ContactPage.blocks({ data });
  return blocks.map((block) => block.render);
}
