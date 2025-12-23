// api/contactsApi.ts
import { Contact, CreateContactRequest } from "@/model/Contact";
import { CreateContactGroupRequest } from "@/model/CreateContactGroupRequest";

export interface PaginatedContacts {
  content: Contact[];
  page: number;
  totalPages: number;
  totalElements: number;
}

export async function getContactsApi(
  getToken: () => Promise<string | null>,
  page: number,
  groupId: number
): Promise<PaginatedContacts> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = await getToken();

  const url = new URL(`${backendUrl}/contacts`);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("groupId", groupId.toString());

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

export async function createContactApi(
  getToken: () => Promise<string | null>,
  request: CreateContactRequest
): Promise<Contact> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = await getToken();

  const res = await fetch(`${backendUrl}/contacts`, {
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

export async function updateContactApi(
  getToken: () => Promise<string | null>,
  contactId: number,
  request: CreateContactRequest
): Promise<Contact> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = await getToken();

  const res = await fetch(`${backendUrl}/contacts/${contactId}`, {
    method: "PUT",
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

export async function deleteContactsApi(
  getToken: () => Promise<string | null>,
  contactIds: number[]
): Promise<string> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = await getToken();

  const res = await fetch(`${backendUrl}/contacts/bulk`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(contactIds),
  });

  const body = await res.text();

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status} - ${body}`);
  }

  return body;
}

export async function moveContactsApi(
  getToken: () => Promise<string | null>,
  contactIds: number[],
  existingGroupId: number,
  toBeMovedGroupId: number
): Promise<string> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = await getToken();

  const url = new URL(`${backendUrl}/contacts/move`);
  url.searchParams.set("existingGroupId", existingGroupId.toString());
  url.searchParams.set("toBeMovedGroupId", toBeMovedGroupId.toString());

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(contactIds),
  });

  const body = await res.text();

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status} - ${body}`);
  }

  return body;
}

export async function copyContactsApi(
  getToken: () => Promise<string | null>,
  contactIds: number[],
  existingGroupId: number,
  toBeMovedGroupId: number
): Promise<string> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = await getToken();

  const url = new URL(`${backendUrl}/contacts/copy`);
  url.searchParams.set("existingGroupId", existingGroupId.toString());
  url.searchParams.set("toBeMovedGroupId", toBeMovedGroupId.toString());

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(contactIds),
  });

  const body = await res.text();

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status} - ${body}`);
  }

  return body;
}