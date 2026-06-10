import { Suspense, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toolsBySlug, toolsByCategory } from "@/data/tools";
import { categoryMap } from "@/data/categories";
import { brand } from "@/brand";
import { ToolCard } from "@/components/tool/ToolCard";
import { ToolSkeleton } from "@/components/tool/ToolSkeleton";
import { ToolSeo } from "@/components/tool/ToolSeo";
import { ToolFaqs } from "@/components/tool/ToolFaqs";
import { useRecent } from "@/hooks/useRecent";

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? toolsBySlug[slug] : undefined;
  const { push } = useRecent();

  useEffect(() => {
    if (tool) push(tool.slug);
    if (tool) document.title = `${tool.name} · ${brand.name}`;
    return () => {
      document.title = `${brand.name} — ${brand.tagline}`;
    };
  }, [tool, push]);

  if (!tool) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="text-2xl font-semibold">Tool not found</h1>
        <Link to="/" className="mt-3 inline-block text-sm text-primary underline">
          ← Back home
        </Link>
      </div>
    );
  }

  const ToolComponent = tool.component;
  const cat = categoryMap[tool.category];
  const related = toolsByCategory(tool.category)
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 6);

  return (
    <>
      <ToolSeo tool={tool} />
      <Suspense fallback={<ToolSkeleton />}>
        <ToolComponent />
      </Suspense>

      <ToolFaqs slug={tool.slug} />

      {related.length > 0 && (
        <div className="mx-auto w-full max-w-6xl border-t px-4 py-10 md:px-8">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              More in {cat.name}
            </h2>
            <Link
              to={`/category/${cat.id}`}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {related.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
