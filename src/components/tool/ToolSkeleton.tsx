/**
 * Loading skeleton shown while a lazy-loaded tool component is being fetched.
 * Mirrors the rough shape of a typical tool page so the layout doesn't jump.
 */
export function ToolSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-8">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2">
        <div className="h-3 w-12 animate-pulse rounded bg-muted" />
        <span className="text-muted-foreground/40">/</span>
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        <span className="text-muted-foreground/40">/</span>
        <div className="h-3 w-32 animate-pulse rounded bg-muted" />
      </div>

      {/* Heading */}
      <div className="mb-6 space-y-2">
        <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-muted/60" />
      </div>

      {/* Body — two-pane shape */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-3 h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="h-72 animate-pulse rounded-md bg-muted/40" />
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-3 h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="h-72 animate-pulse rounded-md bg-muted/40" />
        </div>
      </div>
    </div>
  );
}
