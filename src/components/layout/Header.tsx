import { Menu, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { BrandWordmark } from "@/components/Brand";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

type Props = {
  onMenuClick: () => void;
  onSearchClick: () => void;
};

export function Header({ onMenuClick, onSearchClick }: Props) {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Link to="/" className="md:hidden" aria-label={t("app.name")}>
        <BrandWordmark size="sm" />
      </Link>

      <button
        type="button"
        onClick={onSearchClick}
        className="ml-auto hidden h-9 max-w-md flex-1 items-center gap-2 rounded-md border bg-card/40 px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground md:flex"
      >
        <Search className="h-4 w-4" />
        <span>{t("search.placeholder")}</span>
        <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          Ctrl K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1 md:ml-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSearchClick}
          aria-label="Search"
          className="md:hidden"
        >
          <Search className="h-4 w-4" />
        </Button>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
