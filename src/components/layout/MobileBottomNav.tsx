import { Link, useLocation } from "react-router-dom";
import { Home, Search, LayoutGrid, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  onSearchClick: () => void;
  onCategoriesClick: () => void;
  onFavoritesClick: () => void;
};

function Item({
  label,
  Icon,
  active,
  onClick,
  to,
}: {
  label: string;
  Icon: React.ElementType;
  active: boolean;
  onClick?: () => void;
  to?: string;
}) {
  const classes = cn(
    "flex h-full w-full flex-col items-center justify-center gap-0.5 text-xs",
    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={label}>
        <Icon className={cn("h-5 w-5", active && "fill-current/10")} />
        <span>{label}</span>
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      style={{ minHeight: 44 }}
      aria-label={label}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}

export function MobileBottomNav({
  onSearchClick,
  onCategoriesClick,
  onFavoritesClick,
}: Props) {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur md:hidden">
      <div className="grid h-16 grid-cols-4">
        <Item label="Home" Icon={Home} active={pathname === "/"} to="/" />
        <Item label="Search" Icon={Search} active={false} onClick={onSearchClick} />
        <Item
          label="Browse"
          Icon={LayoutGrid}
          active={pathname.startsWith("/category")}
          onClick={onCategoriesClick}
        />
        <Item label="Saved" Icon={Star} active={false} onClick={onFavoritesClick} />
      </div>
      <div style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
    </nav>
  );
}
