import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/data/faqs";
import { cn } from "@/lib/utils";

export function ToolFaqs({ slug }: { slug: string }) {
  const faqs = FAQS[slug];
  if (!faqs || faqs.length === 0) return null;
  return <FaqList faqs={faqs} />;
}

function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto w-full max-w-3xl border-t px-4 py-10 md:px-8">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Frequently asked questions
      </h2>
      <ul className="space-y-2">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <li key={i} className="rounded-lg border bg-card">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium hover:bg-accent/40"
              >
                <span>{f.q}</span>
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <p className="px-4 pb-3 text-sm text-muted-foreground">{f.a}</p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
