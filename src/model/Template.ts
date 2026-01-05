// src/model/Template.ts

import { TemplateType } from "./TemplateType";

export interface Template {
  id: number;
  name: string;
  mjmlContent: string;
  type: TemplateType;
  userId?: string | null;
}
