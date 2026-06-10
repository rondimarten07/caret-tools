import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Github, Heart, ShieldCheck, WifiOff, Wrench, Zap } from "lucide-react";
import { BrandWordmark } from "@/components/Brand";
import { brand } from "@/brand";
import { categories } from "@/data/categories";
import { tools, toolsByCategory } from "@/data/tools";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-card/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-12">
        {/* Stats row */}
        <div className="mb-10 grid grid-cols-3 gap-3 sm:grid-cols-3">
          <Stat value={tools.length} label="tools" icon={Zap} />
          <Stat value={categories.length} label="categories" icon={Wrench} />
          <Stat value="100%" label="client-side" icon={ShieldCheck} />
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <BrandWordmark size="md" />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {brand.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Privacy first
              </span>
              <span className="inline-flex items-center gap-1">
                <WifiOff className="h-3 w-3" />
                Offline-ready
              </span>
            </div>
          </div>

          {[0, 1, 2].map((col) => {
            const slice = categories.slice(col * 4, col * 4 + 4);
            if (slice.length === 0) return null;
            return (
              <div key={col}>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {col === 0 ? "Top categories" : ""}
                </h4>
                <ul className="space-y-2 text-sm">
                  {slice.map((c) => (
                    <li key={c.id}>
                      <Link
                        to={`/category/${c.id}`}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {c.name}{" "}
                        <span className="text-xs opacity-60">
                          ({toolsByCategory(c.id).length})
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} {t("app.name")} · Built with{" "}
            <Heart className="inline h-3 w-3 fill-rose-500 text-rose-500" /> open source.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/favorites" className="hover:text-foreground">
              {t("nav.saved")}
            </Link>
            <a
              href={brand.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              <Github className="h-3 w-3" />
              Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Stat({
  value,
  label,
  icon: Icon,
}: {
  value: number | string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 text-center">
      <Icon className="mx-auto mb-1 h-4 w-4 text-primary" />
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
