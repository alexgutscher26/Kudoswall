import React from "react";

interface JsonLdProps {
  data: Record<string, any>;
}

/**
 * Reusable JSON-LD component for injecting structured data.
 * Adheres to Google's technical guidelines for rich entries.
 */
export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  const jsonString = JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonString }} />;
};
