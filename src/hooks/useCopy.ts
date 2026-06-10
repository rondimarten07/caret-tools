import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useCopy(timeout = 1500) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string, label = "Copied to clipboard") => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success(label);
        setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        toast.error("Failed to copy");
        return false;
      }
    },
    [timeout]
  );

  return { copy, copied };
}
