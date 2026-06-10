import {
  Code2,
  Palette,
  Type,
  ArrowLeftRight,
  Sparkles,
  Globe,
  Calculator,
  Image,
  ShieldCheck,
  Clock,
  type LucideIcon,
} from "lucide-react";

export type CategoryId =
  | "programming"
  | "design"
  | "text"
  | "converter"
  | "generator"
  | "network"
  | "math"
  | "image"
  | "security"
  | "time";

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
  icon: LucideIcon;
  /** Text color for the icon glyph */
  accent: string;
  /** Tinted background + ring for the icon BADGE ONLY (never card-wide) */
  surface: string;
  /** Subtle inner glow for the mini-preview frame */
  glow: string;
};

/*
  Color philosophy
  ───────────────────────────────────────────────────────────────
  Color is SIGNAL, deployed surgically.
  - Card surface stays neutral (bg-card / border).
  - The 36-44px icon BADGE carries a low-saturation category tint
    (50/70 in light, 950/30 in dark) so cards are recognizable at
    a glance without competing with each other.
  - The mini-preview frame gets a barely-there inner glow tinted
    by the same category color — appears mostly on hover.
*/

export const categories: Category[] = [
  {
    id: "programming",
    name: "Programming",
    description: "Formatters, encoders, parsers & dev utilities.",
    icon: Code2,
    accent: "text-indigo-600 dark:text-indigo-300",
    surface: "bg-indigo-50/80 ring-indigo-200/60 dark:bg-indigo-950/40 dark:ring-indigo-900/50",
    glow: "from-indigo-100/30 dark:from-indigo-950/30",
  },
  {
    id: "design",
    name: "Designer",
    description: "Colors, gradients, CSS helpers & visual tools.",
    icon: Palette,
    accent: "text-pink-600 dark:text-pink-300",
    surface: "bg-pink-50/80 ring-pink-200/60 dark:bg-pink-950/40 dark:ring-pink-900/50",
    glow: "from-pink-100/30 dark:from-pink-950/30",
  },
  {
    id: "text",
    name: "Text",
    description: "Manipulate, count, diff & transform text.",
    icon: Type,
    accent: "text-amber-600 dark:text-amber-300",
    surface: "bg-amber-50/80 ring-amber-200/60 dark:bg-amber-950/40 dark:ring-amber-900/50",
    glow: "from-amber-100/30 dark:from-amber-950/30",
  },
  {
    id: "converter",
    name: "Converter",
    description: "Convert between units, formats and bases.",
    icon: ArrowLeftRight,
    accent: "text-emerald-600 dark:text-emerald-300",
    surface: "bg-emerald-50/80 ring-emerald-200/60 dark:bg-emerald-950/40 dark:ring-emerald-900/50",
    glow: "from-emerald-100/30 dark:from-emerald-950/30",
  },
  {
    id: "generator",
    name: "Generator",
    description: "Passwords, QR codes, fake data & more.",
    icon: Sparkles,
    accent: "text-violet-600 dark:text-violet-300",
    surface: "bg-violet-50/80 ring-violet-200/60 dark:bg-violet-950/40 dark:ring-violet-900/50",
    glow: "from-violet-100/30 dark:from-violet-950/30",
  },
  {
    id: "network",
    name: "Network",
    description: "URLs, user-agents, subnets and web helpers.",
    icon: Globe,
    accent: "text-cyan-600 dark:text-cyan-300",
    surface: "bg-cyan-50/80 ring-cyan-200/60 dark:bg-cyan-950/40 dark:ring-cyan-900/50",
    glow: "from-cyan-100/30 dark:from-cyan-950/30",
  },
  {
    id: "math",
    name: "Math",
    description: "Calculators for everyday and special use.",
    icon: Calculator,
    accent: "text-orange-600 dark:text-orange-300",
    surface: "bg-orange-50/80 ring-orange-200/60 dark:bg-orange-950/40 dark:ring-orange-900/50",
    glow: "from-orange-100/30 dark:from-orange-950/30",
  },
  {
    id: "image",
    name: "Image",
    description: "Compress, resize, convert & inspect images.",
    icon: Image,
    accent: "text-rose-600 dark:text-rose-300",
    surface: "bg-rose-50/80 ring-rose-200/60 dark:bg-rose-950/40 dark:ring-rose-900/50",
    glow: "from-rose-100/30 dark:from-rose-950/30",
  },
  {
    id: "security",
    name: "Security",
    description: "Hashes, ciphers, JWTs and crypto helpers.",
    icon: ShieldCheck,
    accent: "text-teal-600 dark:text-teal-300",
    surface: "bg-teal-50/80 ring-teal-200/60 dark:bg-teal-950/40 dark:ring-teal-900/50",
    glow: "from-teal-100/30 dark:from-teal-950/30",
  },
  {
    id: "time",
    name: "Time",
    description: "Clocks, timers and date utilities.",
    icon: Clock,
    accent: "text-sky-600 dark:text-sky-300",
    surface: "bg-sky-50/80 ring-sky-200/60 dark:bg-sky-950/40 dark:ring-sky-900/50",
    glow: "from-sky-100/30 dark:from-sky-950/30",
  },
];

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.id, c])
) as Record<CategoryId, Category>;
