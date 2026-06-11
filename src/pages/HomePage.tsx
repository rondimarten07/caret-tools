import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Star, ArrowRight, ShieldCheck, WifiOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { categories } from "@/data/categories";
import { tools, toolsByCategory, toolsBySlug } from "@/data/tools";
import { ToolCard } from "@/components/tool/ToolCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecent } from "@/hooks/useRecent";
import { CategoryPreview } from "@/components/layout/CategoryPreview";
import { brand } from "@/brand";
import { cn } from "@/lib/utils";

const FEATURED_SLUGS = [
  "json-formatter",
  "color-picker",
  "qr-code-generator",
  "password-generator",
  "regex-tester",
  "gradient-generator",
];

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const { list: favIds } = useFavorites();
  const { list: recentIds } = useRecent();

  const favorites = favIds.map((s) => toolsBySlug[s]).filter(Boolean);
  const recent = recentIds.map((s) => toolsBySlug[s]).filter(Boolean);
  const featured = FEATURED_SLUGS.map((s) => toolsBySlug[s]).filter(Boolean);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q2 = q.trim().toLowerCase();
    if (!q2) return;
    const hit = tools.find(
      (t) =>
        t.slug.includes(q2) ||
        t.name.toLowerCase().includes(q2) ||
        t.keywords.some((k) => k.includes(q2))
    );
    if (hit) navigate(`/tool/${hit.slug}`);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-4 md:px-8 md:pb-12 md:pt-8">
      {/* ============================ HERO ============================ */}
      {/*
        Restrained hero. No gradient mesh. No tint.
        Just: a single soft top-right glow, faint grid, monochrome type.
        Brand-accent only on the search submit button and one underline.
      */}
      <section className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-14">
        {/* Soft top-right light — single primary glow, very low alpha */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.10) 0%, transparent 60%)",
          }}
        />
        <div className="dotted-bg pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative">
          <span
            className="animate-rise inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
            style={{ ["--i" as string]: 0 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {tools.length} tools · free · in-browser
          </span>

          <h1
            className="animate-rise mt-6 max-w-2xl text-balance text-4xl font-bold tracking-tight md:text-6xl"
            style={{ ["--i" as string]: 1 }}
          >
            {brand.tagline.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="relative inline-block">
              <span className="text-foreground">
                {brand.tagline.split(" ").slice(-1)[0]}
              </span>
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-primary/70" />
            </span>
          </h1>

          <p
            className="animate-rise mt-4 max-w-xl text-balance text-sm text-muted-foreground md:text-base"
            style={{ ["--i" as string]: 2 }}
          >
            {brand.description}
          </p>

          <form
            onSubmit={onSearch}
            className="animate-rise mt-7 flex max-w-xl items-center gap-2 rounded-full border bg-background p-1.5 shadow-sm"
            style={{ ["--i" as string]: 3 }}
          >
            <Search className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("search.placeholderLong", { count: tools.length })}
              className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
            />
            <Button type="submit" className="rounded-full px-5" disabled={!q.trim()}>
              {t("search.find")} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <div
            className="animate-rise mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
            style={{ ["--i" as string]: 4 }}
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              No data ever leaves your browser
            </span>
            <span className="inline-flex items-center gap-1.5">
              <WifiOff className="h-3.5 w-3.5" />
              Works offline
            </span>
            <span className="hidden items-center gap-1 md:flex">
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Ctrl</kbd>
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">K</kbd>
              <span className="ml-0.5">to search</span>
            </span>
          </div>
        </div>
      </section>

      {/* ========================= FAVORITES ========================= */}
      {favorites.length > 0 && (
        <Section
          title={t("nav.yourFavorites")}
          icon={<Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {favorites.map((tool, idx) => (
              <div
                key={tool.slug}
                className="animate-rise"
                style={{ ["--i" as string]: idx }}
              >
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ============================ RECENT ============================ */}
      {recent.length > 0 && (
        <Section title={t("nav.recently")}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {recent.map((tool, idx) => (
              <div
                key={tool.slug}
                className="animate-rise"
                style={{ ["--i" as string]: idx }}
              >
                <ToolCard tool={tool} compact />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ============================ CATEGORIES BENTO ============================ */}
      {/*
        Surface stays neutral, but the icon BADGE carries a tinted glow
        so each card has visual identity. Shadow elevation is always
        present; hover lifts + reveals a chevron + brightens the badge.
      */}
      <Section title={t("nav.categories")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, idx) => {
            const list = toolsByCategory(c.id);
            const Icon = c.icon;
            return (
              <Link
                key={c.id}
                to={`/category/${c.id}`}
                style={{ ["--i" as string]: idx }}
                className={cn(
                  "group animate-rise relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-5",
                  "shadow-[0_1px_2px_hsl(var(--foreground)/0.04),0_4px_12px_hsl(var(--foreground)/0.04)]",
                  "transition-all duration-200",
                  "hover:-translate-y-0.5 hover:border-foreground/15",
                  "hover:shadow-[0_2px_4px_hsl(var(--foreground)/0.06),0_12px_28px_hsl(var(--primary)/0.10)]"
                )}
              >
                {/* Inner glow tinted by category color — strengthens on hover */}
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-100",
                    c.glow
                  )}
                />

                {/* Header: icon badge + count + chevron */}
                <div className="relative flex items-start justify-between">
                  <div
                    className={cn(
                      "grid h-11 w-11 place-items-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-105",
                      c.surface
                    )}
                  >
                    <Icon className={cn("h-5 w-5", c.accent)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted/80 px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums">
                      {list.length}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                </div>

                {/* Title + description */}
                <div className="relative">
                  <div className="text-base font-semibold tracking-tight">
                    {c.name}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {c.description}
                  </p>
                </div>

                {/* Mini-preview frame */}
                <div className="relative rounded-xl border bg-background/60 p-3 ring-1 ring-border/60 transition-colors group-hover:bg-background/90">
                  <CategoryPreview id={c.id} />
                </div>

                {/* Sample tool chips */}
                <div className="relative mt-auto flex flex-wrap items-center gap-1.5">
                  {list.slice(0, 3).map((tool) => (
                    <span
                      key={tool.slug}
                      className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {tool.name}
                    </span>
                  ))}
                  {list.length > 3 && (
                    <span className="text-[11px] text-muted-foreground">
                      +{list.length - 3} more
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* ============================ FEATURED ============================ */}
      <Section
        title={t("nav.featured")}
        subtitle={t("nav.featuredSubtitle")}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((tool, idx) => (
            <div
              key={tool.slug}
              className="animate-rise"
              style={{ ["--i" as string]: idx }}
            >
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 md:mt-14">
      <div className="mb-4 flex items-baseline gap-2">
        <h2 className="section-eyebrow">
          {icon}
          {title}
        </h2>
        {subtitle && (
          <span className="text-xs text-muted-foreground">· {subtitle}</span>
        )}
      </div>
      {children}
    </section>
  );
}
