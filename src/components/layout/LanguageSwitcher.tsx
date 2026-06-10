import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SUPPORTED } from "@/i18n";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = SUPPORTED.find((s) => s.id === i18n.resolvedLanguage) ?? SUPPORTED[0];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[10rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {SUPPORTED.map((s) => (
            <DropdownMenu.Item
              key={s.id}
              onSelect={() => i18n.changeLanguage(s.id)}
              className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none data-[highlighted]:bg-accent"
            >
              <span className="flex-1">{s.name}</span>
              {current.id === s.id && <span className="text-xs text-primary">●</span>}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
