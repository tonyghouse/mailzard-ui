// campaign.model.ts
export interface Campaign {
  name: string;
  templateId: number;
  contactGroupIds: number[];
  scheduledAt: string;
}
