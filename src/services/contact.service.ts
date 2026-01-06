import { createContactRequest } from "../api/contact.api";

export async function submitContact(data: {
  name: string;
  email: string;
  description: string;
}) {
  const res = await createContactRequest(data);
  return res.successData;
}
