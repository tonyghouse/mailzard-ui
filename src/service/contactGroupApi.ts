// api/contactGroupApi.ts
import { ContactGroup } from "@/model/ContactGroup";
import { CreateContactGroupRequest } from "@/model/CreateContactGroupRequest";

export async function getContactGroupsApi(
  getToken: () => Promise<string | null>
): Promise<ContactGroup[]> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = await getToken();

  const res = await fetch(`${backendUrl}/contact-groups`, {
     method: "GET",
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

export async function createContactGroupApi(
  getToken: () => Promise<string | null>,
  request: CreateContactGroupRequest
): Promise<ContactGroup> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = await getToken();

  const res = await fetch(`${backendUrl}/contact-groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const body = await res.text();

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status} - ${body}`);
  }

  return JSON.parse(body);
}

export async function deleteContactGroupApi(
  getToken: () => Promise<string | null>,
  groupId: number
): Promise<string> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = await getToken();

  const res = await fetch(`${backendUrl}/contact-groups/${groupId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await res.text();

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status} - ${body}`);
  }

  return body;
}