// src/lib/mjml.ts
import mjml2html from "mjml";

export function compileMjml(mjml: string): string {
  const { html, errors } = mjml2html(mjml, {
    validationLevel: "soft",
  });

  if (errors?.length) {
    console.error("MJML errors:", errors);
  }

  return html;
}
