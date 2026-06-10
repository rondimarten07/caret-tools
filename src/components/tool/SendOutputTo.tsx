import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ArrowRightLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toolsBySlug } from "@/data/tools";

export type ChainTarget = {
  /** The destination tool's slug */
  slug: string;
  /** The URL-state key that the destination tool reads (matches its useUrlState key) */
  urlKey: string;
  /** Optional human label override */
  label?: string;
};

type Props = {
  /** The current tool's output string */
  output: string;
  /** Tools this output can be piped into */
  targets: ChainTarget[];
};

/**
 * "Send to →" dropdown — pipes the current output as the input of another
 * tool. Encodes the value into the destination URL hash using the same
 * scheme as `useUrlState`, then navigates there.
 */
export function SendOutputTo({ output, targets }: Props) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const go = (target: ChainTarget) => {
    if (!output) return;
    setBusy(true);
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(output)));
      navigate(`/tool/${target.slug}#${target.urlKey}=${encoded}`);
    } finally {
      setBusy(false);
    }
  };

  if (targets.length === 0) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" size="sm" disabled={!output || busy}>
          <ArrowRightLeft className="mr-2 h-3.5 w-3.5" />
          Send to
          <ChevronDown className="ml-1 h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[14rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {targets.map((target) => {
            const tool = toolsBySlug[target.slug];
            if (!tool) return null;
            const Icon = tool.icon;
            return (
              <DropdownMenu.Item
                key={target.slug}
                onSelect={() => go(target)}
                className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none data-[highlighted]:bg-accent"
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{target.label ?? tool.name}</span>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
