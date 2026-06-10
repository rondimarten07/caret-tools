import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCopy } from "@/hooks/useCopy";

type Props = Omit<ButtonProps, "onClick" | "children"> & {
  value: string;
  label?: string;
  children?: React.ReactNode;
};

export function CopyButton({
  value,
  label = "Copied!",
  variant = "outline",
  size = "sm",
  children,
  ...rest
}: Props) {
  const { copy, copied } = useCopy();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => copy(value, label)}
      disabled={!value}
      {...rest}
    >
      {copied ? (
        <Check className="mr-2 h-4 w-4 text-emerald-500" />
      ) : (
        <Copy className="mr-2 h-4 w-4" />
      )}
      {children ?? (copied ? "Copied" : "Copy")}
    </Button>
  );
}
