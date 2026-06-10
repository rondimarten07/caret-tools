import { useMemo, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Star,
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  Github,
  Lightbulb,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { BrandWordmark, BrandMark } from "@/components/Brand";
import { categories } from "@/data/categories";
import { tools, toolsByCategory, toolsBySlug, type Tool } from "@/data/tools";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecent } from "@/hooks/useRecent";
import { useSidebarExpanded, useRailCollapsed } from "@/hooks/useSidebarState";
import { brand } from "@/brand";
import { cn } from "@/lib/utils";

type Props = {
  onNavigate?: () => void;
  onOpenSearch?: () => void;
};

export function Sidebar({ onNavigate, onOpenSearch }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { list: favIds, has, toggle: toggleFav } = useFavorites();
  const { list: recentIds } = useRecent();
  const { isOpen, toggle: toggleGroup } = useSidebarExpanded(["programming"]);
  const { collapsed: rail, toggle: toggleRail } = useRailCollapsed();

  /* ── Search filter ─────────────────────────────────────────── */
  const filtered = useMemo<Tool[] | null>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return tools.filter(
      (tl) =>
        tl.name.toLowerCase().includes(q) ||
        tl.slug.includes(q) ||
        tl.keywords.some((k) => k.includes(q))
    );
  }, [query]);

  const favorites = favIds.map((s) => toolsBySlug[s]).filter(Boolean);
  const recent = recentIds.map((s) => toolsBySlug[s]).filter(Boolean).slice(0, 5);

  /* ───────────────────────── RAIL MODE ───────────────────────── */
  if (rail) {
    return (
      <aside className="flex h-full w-14 shrink-0 flex-col items-center border-r bg-card/40 py-3">
        <Link to="/" onClick={onNavigate} aria-label={brand.name}>
          <BrandMark size="md" />
        </Link>
        <button
          type="button"
          onClick={onOpenSearch}
          className="mt-4 grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          title="Search"
        >
          <Search className="h-4 w-4" />
        </button>
        <div className="mt-4 flex flex-col gap-1 overflow-y-auto scrollbar-thin px-1">
          {categories.map((c) => {
            const Icon = c.icon;
            const count = toolsByCategory(c.id).length;
            return (
              <NavLink
                key={c.id}
                to={`/category/${c.id}`}
                onClick={onNavigate}
                title={`${c.name} (${count})`}
                className={({ isActive }) =>
                  cn(
                    "grid h-9 w-9 place-items-center rounded-md",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  )
                }
              >
                <Icon className={cn("h-4 w-4", c.accent)} />
              </NavLink>
            );
          })}
        </div>
        <button
          type="button"
          onClick={toggleRail}
          className="mt-auto grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          title="Expand sidebar"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      </aside>
    );
  }

  /* ───────────────────────── FULL MODE ───────────────────────── */
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r bg-card/40">
      {/* Top: brand + collapse rail */}
      <div className="flex h-14 items-center justify-between border-b px-3">
        <Link to="/" onClick={onNavigate} aria-label={brand.name}>
          <BrandWordmark size="md" />
        </Link>
        <button
          type="button"
          onClick={toggleRail}
          className="hidden h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground md:grid"
          title="Collapse sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* Live filter input */}
      <div className="px-3 pt-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="h-9 w-full rounded-md border bg-background/60 pl-8 pr-8 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear"
              className="absolute right-2 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          ) : (
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Scrollable list */}
      <nav className="mt-3 flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin">
        {filtered ? (
          /* ── Search results mode ── */
          <Section title={`Results · ${filtered.length}`}>
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-xs text-muted-foreground">
                No tools match "{query}".
              </p>
            ) : (
              <ul className="space-y-0.5">
                {filtered.map((tl) => (
                  <ToolRow
                    key={tl.slug}
                    tool={tl}
                    onNavigate={onNavigate}
                    starred={has(tl.slug)}
                    onToggleStar={() => toggleFav(tl.slug)}
                  />
                ))}
              </ul>
            )}
          </Section>
        ) : (
          /* ── Default mode ── */
          <>
            {favorites.length > 0 && (
              <CollapsibleSection
                id="__favorites"
                title="Favorites"
                count={favorites.length}
                icon={<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                isOpen={isOpen("__favorites") || favorites.length <= 6}
                onToggle={() => toggleGroup("__favorites")}
              >
                <ul className="space-y-0.5">
                  {favorites.map((tl) => (
                    <ToolRow
                      key={tl.slug}
                      tool={tl}
                      onNavigate={onNavigate}
                      starred={true}
                      onToggleStar={() => toggleFav(tl.slug)}
                    />
                  ))}
                </ul>
              </CollapsibleSection>
            )}

            {recent.length > 0 && (
              <CollapsibleSection
                id="__recent"
                title="Recently used"
                count={recent.length}
                icon={<Clock className="h-3.5 w-3.5" />}
                isOpen={isOpen("__recent") || true}
                onToggle={() => toggleGroup("__recent")}
              >
                <ul className="space-y-0.5">
                  {recent.map((tl) => (
                    <ToolRow
                      key={tl.slug}
                      tool={tl}
                      onNavigate={onNavigate}
                      starred={has(tl.slug)}
                      onToggleStar={() => toggleFav(tl.slug)}
                    />
                  ))}
                </ul>
              </CollapsibleSection>
            )}

            {categories.map((c) => {
              const list = toolsByCategory(c.id);
              const Icon = c.icon;
              return (
                <CollapsibleSection
                  key={c.id}
                  id={c.id}
                  title={c.name}
                  count={list.length}
                  icon={
                    <div className={cn("grid h-5 w-5 place-items-center rounded ring-1", c.surface)}>
                      <Icon className={cn("h-3 w-3", c.accent)} />
                    </div>
                  }
                  isOpen={isOpen(c.id)}
                  onToggle={() => toggleGroup(c.id)}
                >
                  <ul className="space-y-0.5">
                    {list.map((tl) => (
                      <ToolRow
                        key={tl.slug}
                        tool={tl}
                        onNavigate={onNavigate}
                        starred={has(tl.slug)}
                        onToggleStar={() => toggleFav(tl.slug)}
                      />
                    ))}
                  </ul>
                </CollapsibleSection>
              );
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t px-3 py-3 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <a
            href={brand.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <Github className="h-3 w-3" /> GitHub
          </a>
          <a
            href={`mailto:?subject=Suggest%20a%20tool%20for%20${encodeURIComponent(brand.name)}`}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <Lightbulb className="h-3 w-3" /> Suggest
          </a>
          <span className="font-mono text-[10px] opacity-60">v0.2</span>
        </div>
      </div>
    </aside>
  );
}

/* ───────────────── helper components ───────────────── */

function CollapsibleSection({
  id,
  title,
  count,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  count: number;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1.5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`section-${id}`}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:bg-accent/40 hover:text-foreground"
      >
        {icon}
        <span className="flex-1">{title}</span>
        <span className="font-mono text-[10px] opacity-70">{count}</span>
        {isOpen ? (
          <ChevronDown className="h-3 w-3 transition-transform" />
        ) : (
          <ChevronRight className="h-3 w-3 transition-transform" />
        )}
      </button>
      {isOpen && (
        <div id={`section-${id}`} className="mt-1 pl-1">
          {children}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-1.5">
      <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}

function ToolRow({
  tool,
  onNavigate,
  starred,
  onToggleStar,
}: {
  tool: Tool;
  onNavigate?: () => void;
  starred: boolean;
  onToggleStar: () => void;
}) {
  const Icon = tool.icon;
  return (
    <li>
      <NavLink
        to={`/tool/${tool.slug}`}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            "group/row relative flex items-center gap-2 rounded-md py-1.5 pl-3 pr-1.5 text-sm",
            isActive
              ? "bg-accent font-medium text-accent-foreground before:absolute before:left-0 before:top-1.5 before:h-5 before:w-0.5 before:rounded-r before:bg-primary"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          )
        }
      >
        <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
        <span className="truncate">{tool.name}</span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleStar();
          }}
          aria-label={starred ? "Unfavorite" : "Favorite"}
          className={cn(
            "ml-auto grid h-5 w-5 shrink-0 place-items-center rounded transition-opacity hover:bg-background/60",
            starred ? "opacity-100" : "opacity-0 group-hover/row:opacity-100"
          )}
        >
          <Star
            className={cn(
              "h-3 w-3",
              starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
            )}
          />
        </button>
      </NavLink>
    </li>
  );
}
