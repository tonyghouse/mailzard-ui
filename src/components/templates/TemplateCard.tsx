"use client";

import { Template } from "@/model/Template";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function TemplateCard({ template }: { template: Template }) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const convertMjml = async () => {
      try {
        setLoading(true);
        const mjml2html = (await import("mjml-browser")).default;

        const result = mjml2html(template.mjmlContent, {
          validationLevel: "soft",
        });

        if (result.errors.length > 0) {
          setError(
            `MJML Errors: ${result.errors.map((e) => e.message).join(", ")}`
          );
        } else {
          setError("");
        }

        setHtmlContent(result.html);
      } catch (err) {
        setError(
          `Failed to parse MJML: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setHtmlContent("");
      } finally {
        setLoading(false);
      }
    };

    convertMjml();
  }, [template.mjmlContent]);

  return (
    <div className="bg-card border border-border rounded-md overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-secondary">
        <h3 className="text-sm font-semibold text-foreground truncate">
          {template.name}
        </h3>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mt-3 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {/* Preview */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Preview
          </h4>
        </div>

        {loading ? (
          <div className="h-[180px] flex items-center justify-center border border-border bg-muted rounded-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
              <p className="text-xs text-muted-foreground">
                Rendering preview…
              </p>
            </div>
          </div>
        ) : (
          <div className="border border-border rounded-sm bg-muted overflow-hidden">
            <div className="relative h-[180px] w-full">
              <iframe
                srcDoc={htmlContent}
                title={`Preview of ${template.name}`}
                sandbox="allow-same-origin"
                className="absolute inset-0 border-0"
                style={{
                  transform: "scale(0.6)",
                  transformOrigin: "top left",
                  width: "166%",
                  height: "166%",
                }}
              />
            </div>
          </div>
        )}

        {/* MJML Source */}
        <details className="group">
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
            View MJML source
          </summary>
          <pre className="mt-2 max-h-48 overflow-auto rounded-sm border border-border bg-background p-3 text-[11px] leading-relaxed text-foreground">
            <code>{template.mjmlContent}</code>
          </pre>
        </details>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end border-t border-border bg-secondary px-4 py-3">
        <Link
          href={{
            pathname: "/edit",
            query: { templateId: template.id },
          }}
        >
          <button className="text-xs font-medium text-primary hover:underline">
            Use template →
          </button>
        </Link>
      </div>
    </div>
  );
}

export default TemplateCard;
