import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/useCopy";

export type CopyVariant = {
  label: string;
  /** Either a static string or a function that runs at click time. */
  value: string | (() => string);
  hint?: string;
};

type Props = {
  variants: CopyVariant[];
  triggerLabel?: string;
};

/**
 * "Copy as…" multi-format dropdown.
 * Lets a tool offer copying its result in several flavors
 * (e.g. cURL, fetch, object literal, escaped string).
 */
export function CopyAs({ variants, triggerLabel = "Copy as" }: Props) {
  const { copy, copied } = useCopy();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" size="sm">
          {copied ? (
            <Check className="mr-2 h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="mr-2 h-3.5 w-3.5" />
          )}
          {triggerLabel}
          <ChevronDown className="ml-1 h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {variants.map((v) => (
            <DropdownMenu.Item
              key={v.label}
              onSelect={() => {
                const value = typeof v.value === "function" ? v.value() : v.value;
                copy(value, `${v.label} copied`);
              }}
              className="flex cursor-pointer items-start gap-2 rounded-sm px-3 py-2 text-sm outline-none data-[highlighted]:bg-accent"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium">{v.label}</div>
                {v.hint && (
                  <div className="text-xs text-muted-foreground">{v.hint}</div>
                )}
              </div>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
