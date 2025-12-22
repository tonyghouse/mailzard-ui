import { Contact } from "@/model/Contact";

export interface PaginatedContacts {
  content: Contact[];
  page: number;
  totalPages: number;
  totalElements: number;
}

export async function getContactsApi(
  getToken: () => Promise<string | null>,
  page: number,
  groupId: number | null
): Promise<PaginatedContacts> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = await getToken();

  const url = new URL(`${backendUrl}/contacts`);
  url.searchParams.set("page", page.toString());
  if(groupId){
      url.searchParams.set("groupId", groupId.toString());
  }

  const res = await fetch(url.toString(), {
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
