// src/service/getTemplateApi.ts

import { Template } from "@/model/Template";


export async function getTemplateApi(
  getToken: () => Promise<string | null>,
  id: number
): Promise<Template> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = await getToken();

   const url = `${backendUrl}/templates/${id}`;

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

  return JSON.parse(body) as Template;
}
