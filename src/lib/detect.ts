/**
 * Light-weight input format auto-detection.
 * Returns the most likely format or "unknown".
 */
export type DetectedFormat = "json" | "yaml" | "xml" | "csv" | "toml" | "unknown";

export function detectFormat(input: string): DetectedFormat {
  const t = input.trim();
  if (!t) return "unknown";

  // JSON: starts with { or [, ends with } or ]
  if ((t[0] === "{" || t[0] === "[") && (t.at(-1) === "}" || t.at(-1) === "]")) {
    try {
      JSON.parse(t);
      return "json";
    } catch {
      /* fall through */
    }
  }

  // XML: starts with <?xml or <tag>
  if (t.startsWith("<?xml") || /^<[a-zA-Z][^>]*>/.test(t)) return "xml";

  // TOML: contains [section] header on its own line
  if (/^\[[\w.-]+\]\s*$/m.test(t)) return "toml";

  // CSV: multi-line, every line has same comma count, and there are commas
  const lines = t.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length >= 2) {
    const commas = lines.map((l) => (l.match(/,/g) ?? []).length);
    if (commas[0] >= 1 && commas.every((c) => c === commas[0])) return "csv";
  }

  // YAML: looks like "key: value" lines, often top-level
  const yamlLine = /^[\w-]+\s*:\s+\S/;
  const yamlCount = lines.filter((l) => yamlLine.test(l)).length;
  if (yamlCount >= 1 && yamlCount / Math.max(1, lines.length) > 0.5) return "yaml";

  return "unknown";
}
