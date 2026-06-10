import type { ReactNode } from "react";
import { ArrowRight, ArrowLeft, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  left: ReactNode;
  right: ReactNode;
  direction?: "right" | "left";
  onSwap?: () => void;
};

/**
 * Split-pane layout with a center swap arrow.
 * Pattern from transform.tools — clean, low-chrome way to express
 * a two-way conversion. Click the center arrow to swap direction.
 *
 * On mobile the arrow stacks between the two panes.
 */
export function SwapPane({ left, right, direction = "right", onSwap }: Props) {
  const Arrow = direction === "right" ? ArrowRight : ArrowLeft;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]">
      <div className="lg:order-1">{left}</div>

      <div className="order-1 grid place-items-center lg:order-2">
        {onSwap ? (
          <Button
            variant="outline"
            size="icon"
            onClick={onSwap}
            aria-label="Swap direction"
            className="h-10 w-10 rounded-full bg-background shadow-md transition-transform hover:scale-110 hover:border-primary/50"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="grid h-10 w-10 place-items-center rounded-full bg-background ring-1 ring-border">
            <Arrow className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="order-2 lg:order-3">{right}</div>
    </div>
  );
}
