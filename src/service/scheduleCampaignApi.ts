// api/saveUserCampaign.ts

import { Campaign } from "@/model/Campaign";

export async function scheduleCampaignApi(
  getToken: () => Promise<string | null>,
  request: Campaign
): Promise<Campaign> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = await getToken();

  const res = await fetch(`${backendUrl}/campaigns`, {
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