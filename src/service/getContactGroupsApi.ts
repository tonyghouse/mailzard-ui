import { ContactGroup } from "@/model/ContactGroup";

export async function getContactGroupsApi(
  getToken: () => Promise<string | null>
): Promise<ContactGroup[]> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = await getToken();

  const res = await fetch(`${backendUrl}/contact-groups`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await res.text();

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status} - ${body}`);
  }

  return JSON.parse(body);
}
