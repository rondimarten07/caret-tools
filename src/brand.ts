/**
 * ──────────────────────────────────────────────────────────────────────
 *  Caret — Brand Identity
 *  Single source of truth for naming, voice, colors, type.
 *  Import from here so the brand never drifts across the app.
 * ──────────────────────────────────────────────────────────────────────
 *
 *  Why "Caret"
 *  ───────────
 *  The caret symbol (^) is the cursor that marks WHERE you act.
 *  In code editors it's the insertion point. In math it raises.
 *  In typography it inserts. It is small, sharp, and precise —
 *  everything we want this product to feel like.
 *
 *  "Carat" is its homophone — a measure of gemstone quality. We
 *  steal the connotation: every tool here is a small, considered
 *  thing rather than a noisy bundle of features.
 */

export const brand = {
  /* ── Identity ─────────────────────────────────────────────────────── */
  name: "Caret",
  shortName: "Caret",
  domain: "caret.app",
  tagline: "Precision tools, in your pocket.",
  description:
    "A calm, in-browser toolbox of 100+ small utilities for developers, designers and makers. Privacy by default — nothing leaves your device.",

  /* ── Voice ────────────────────────────────────────────────────────── */
  voice: {
    pillars: [
      "Sharp — every word earns its place",
      "Precise — the right tool, not the loud one",
      "Useful — every sentence helps the user finish a task",
      "Private by default — privacy is posture, not a feature",
    ],
    do: [
      "Lead with the verb (Format, Convert, Generate)",
      "State what a tool does in 6 words or fewer",
      "Sentence case in UI copy",
      "End the tagline with a period — the caret rests",
    ],
    dont: [
      "Don't use decorative emojis",
      "Don't use exclamation marks in tool copy",
      "Don't say 'amazing', 'powerful', 'next-gen'",
    ],
  },

  /* ── Color system ─────────────────────────────────────────────────── */
  /**
   * Color is signal, not decoration.
   * 90% of the UI renders in pure neutrals.
   * Brand indigo appears only on: logo mark, primary CTAs, focus rings,
   * one accent in the hero, category-icon glyphs. Never card-wide.
   */
  colors: {
    brand: {
      indigo600: "#4f46e5", // primary — used SPARINGLY
      indigo50: "#eef2ff",  // primary tint
      indigo400: "#818cf8", // dark mode primary
    },
    ink: {
      950: "#09090b",  // foreground (light)
      50: "#fafafa",   // foreground (dark)
    },
    surface: {
      0: "#ffffff",    // bg (light)
      900: "#0a0a0c",  // bg (dark) — cool near-black, never #000
    },
    line: {
      200: "#e4e4e7",  // border (light)
      800: "#27272a",  // border (dark)
    },
  },

  /* ── Typography ───────────────────────────────────────────────────── */
  type: {
    sans: "Inter, ui-sans-serif, system-ui",
    mono: "JetBrains Mono, ui-monospace, SFMono-Regular",
    scale: {
      micro: "10px",
      caption: "12px",
      body: "14px",
      lead: "16px",
      h3: "20px",
      h2: "24px",
      h1Desktop: "56px",
      h1Mobile: "36px",
    },
    tracking: {
      tight: "-0.02em",
      base: "-0.005em",
      eyebrow: "0.12em",
    },
  },

  /* ── Logo usage ───────────────────────────────────────────────────── */
  logo: {
    minSize: 20,            // px — smallest the mark may appear
    clearSpace: "0.5x",     // clear space = half mark height
    primaryUse: "wordmark", // prefer "Caret." over mark-only
    // The mark is a single upward chevron (the ^ glyph itself,
    // 2.4px stroke, rounded caps, sitting in a 7-radius indigo tile).
  },

  /* ── External / social ────────────────────────────────────────────── */
  links: {
    github: "https://github.com/anthropics/claude-code",
  },
} as const;

export type Brand = typeof brand;
