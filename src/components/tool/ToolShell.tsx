import type { ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRight, Home, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/useCopy";
import { EmbedButton } from "./EmbedButton";

type Props = {
  title: string;
  description?: string;
  category?: { id: string; name: string };
  actions?: ReactNode;
  /** Set to true if this tool syncs its state to the URL (`useUrlState`).
   *  Renders a small Share button that copies window.location.href. */
  shareable?: boolean;
  /** Hide the universal Embed button for tools that don't make sense embedded. */
  embeddable?: boolean;
  children: ReactNode;
  className?: string;
};

function ShareButton() {
  const { copy } = useCopy();
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => copy(window.location.href, "Share link copied")}
    >
      <Share2 className="mr-2 h-3.5 w-3.5" />
      Share
    </Button>
  );
}

export function ToolShell({
  title,
  description,
  category,
  actions,
  shareable = false,
  embeddable = true,
  children,
  className,
}: Props) {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const isEmbedded = new URLSearchParams(location.search).get("embed") === "1";

  if (isEmbedded) {
    // Stripped layout for iframe embedding
    return (
      <div className="mx-auto w-full max-w-6xl p-3 md:p-4">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
            {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
        <div className={cn("space-y-3", className)}>{children}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-8">
      <nav className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 hover:text-foreground">
          <Home className="h-3 w-3" /> Home
        </Link>
        {category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/category/${category.id}`} className="hover:text-foreground">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground/80">{title}</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {shareable && <ShareButton />}
          {embeddable && slug && <EmbedButton slug={slug} toolName={title} />}
          {actions}
        </div>
      </div>

      <div className={cn("space-y-4", className)}>{children}</div>
    </div>
  );
}
