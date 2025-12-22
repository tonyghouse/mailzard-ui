// src/service/fetchPaginatedTemplatesApi.ts

import { TemplatePage } from "@/model/TemplatePage";


export async function getPaginatedTemplatesApi(
  getToken: () => Promise<string | null>,
  page: number,
): Promise<TemplatePage> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = await getToken();

  const url = new URL(`${backendUrl}/templates/`);
  url.searchParams.append("page", page.toString());

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await res.text();

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status} - ${body}`);
  }

  return JSON.parse(body) as TemplatePage;
}
