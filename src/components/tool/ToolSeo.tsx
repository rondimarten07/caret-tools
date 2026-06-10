import { useEffect } from "react";
import { brand } from "@/brand";
import type { Tool } from "@/data/tools";
import { categoryMap } from "@/data/categories";
import { FAQS } from "@/data/faqs";

/**
 * Injects JSON-LD structured data into <head> so search engines can
 * understand each tool page. Up to three schemas per page:
 *
 *   1. SoftwareApplication — describes the tool itself
 *   2. BreadcrumbList     — Home › Category › Tool navigation hint
 *   3. FAQPage            — only if the tool has FAQs in src/data/faqs.ts
 *
 * Removes its <script> tag on unmount so /tool/ navigations stay clean.
 */
export function ToolSeo({ tool }: { tool: Tool }) {
  useEffect(() => {
    const cat = categoryMap[tool.category];
    const site = brand.domain.startsWith("http") ? brand.domain : `https://${brand.domain}`;
    const url = `${site}/tool/${tool.slug}`;

    const software = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `${tool.name} · ${brand.name}`,
      description: tool.description,
      applicationCategory: "Utility",
      operatingSystem: "Web Browser",
      url,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Organization", name: brand.name },
      keywords: tool.keywords.join(", "),
    };

    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site },
        { "@type": "ListItem", position: 2, name: cat.name, item: `${site}/category/${cat.id}` },
        { "@type": "ListItem", position: 3, name: tool.name, item: url },
      ],
    };

    const schemas: object[] = [software, breadcrumb];

    const faqs = FAQS[tool.slug];
    if (faqs && faqs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      });
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.toolSeo = tool.slug;
    script.textContent = JSON.stringify(schemas);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [tool]);

  return null;
}
