#!/usr/bin/env node
/**
 * Bulk-applies the shareable URL state pattern to remaining tools.
 *
 * For each target file:
 *   1. Add `import { useUrlState } from "@/hooks/useUrlState";` after the
 *      `import { ToolShell }` line, only if not already imported.
 *   2. Replace the first `const [VAR, setVAR] = useState(EXPR);`
 *      with `const [VAR, setVAR] = useUrlState(URL_KEY, EXPR);`
 *      using a per-file config.
 *   3. Insert `shareable\n      ` before `actions={` in the ToolShell tag
 *      (or before the closing `>` if no actions present), only if the
 *      file doesn't already contain the literal `shareable`.
 *
 * Idempotent — safe to re-run. Reports per-file what changed.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Per-tool config:
 *   path       — relative to src/tools
 *   var        — state variable name (e.g. "input", "text", "code")
 *   urlKey     — URL hash key (e.g. "text", "json", "code")
 *   init       — exact init expression to match in useState(<init>)
 *                Use null to match any (lazy fallback — risky, only when needed)
 */
const TARGETS = [
  // ── Programming ──
  { path: "programming/JsFormatter.tsx", var: "input", urlKey: "text" },
  { path: "programming/HtmlEntities.tsx", var: "input", urlKey: "text" },
  { path: "programming/CronParser.tsx", var: "expr", urlKey: "cron" },
  { path: "programming/EnvConverter.tsx", var: "input", urlKey: "text" },
  { path: "programming/GraphqlFormatter.tsx", var: "input", urlKey: "text" },
  { path: "programming/Sha3Hash.tsx", var: "input", urlKey: "text" },
  { path: "programming/JsonSortKeys.tsx", var: "input", urlKey: "json" },
  { path: "programming/CrcCalculator.tsx", var: "input", urlKey: "text" },
  { path: "programming/JsToJson.tsx", var: "input", urlKey: "code" },
  { path: "programming/CurlToCode.tsx", var: "src", urlKey: "curl" },
  { path: "programming/NumberBase.tsx", skipState: true }, // bigint, complex
  // ── Designer ──
  { path: "design/ColorPalette.tsx", var: "base", urlKey: "hex" },
  { path: "design/GradientGenerator.tsx", skipState: true }, // complex stops
  { path: "design/ContrastChecker.tsx", skipState: true }, // two colors
  { path: "design/BoxShadow.tsx", skipState: true }, // many sliders
  { path: "design/BorderRadius.tsx", skipState: true },
  { path: "design/ClipPath.tsx", skipState: true },
  { path: "design/Glassmorphism.tsx", skipState: true },
  { path: "design/CssAnimation.tsx", skipState: true },
  { path: "design/SvgViewer.tsx", var: "svg", urlKey: "svg" },
  { path: "design/MermaidEditor.tsx", var: "code", urlKey: "code" },
  { path: "design/CssUnit.tsx", skipState: true }, // px number
  { path: "design/AnsiColor.tsx", var: "text", urlKey: "text" },
  { path: "design/ColorBlender.tsx", skipState: true }, // two colors
  { path: "design/SvgOptimizer.tsx", var: "input", urlKey: "svg" },
  { path: "design/CssGrid.tsx", skipState: true },
  { path: "design/CssFlexbox.tsx", skipState: true },
  // ── Text ──
  { path: "text/WordCounter.tsx", var: "text", urlKey: "text" },
  { path: "text/TextDiff.tsx", var: "a", urlKey: "a", second: { var: "b", urlKey: "b" } },
  { path: "text/SortLines.tsx", var: "text", urlKey: "text" },
  { path: "text/RemoveDuplicates.tsx", var: "text", urlKey: "text" },
  { path: "text/WhitespaceCleaner.tsx", var: "text", urlKey: "text" },
  { path: "text/ReverseText.tsx", var: "text", urlKey: "text" },
  { path: "text/AsciiArt.tsx", var: "text", urlKey: "text" },
  { path: "text/UnicodeInspector.tsx", var: "text", urlKey: "text" },
  { path: "text/MarkdownTable.tsx", skipState: true }, // grid state
  { path: "text/MarkdownToc.tsx", var: "md", urlKey: "md" },
  { path: "text/MarkdownPreview.tsx", var: "md", urlKey: "md" },
  { path: "text/EscapeString.tsx", var: "input", urlKey: "text" },
  // ── Converter ──
  { path: "converter/RomanNumeral.tsx", skipState: true }, // dual state
  { path: "converter/ByteSize.tsx", skipState: true }, // dropdown system
  { path: "converter/MarkdownHtml.tsx", var: "md", urlKey: "md" },
  { path: "converter/NumberToWords.tsx", var: "n", urlKey: "n" },
  { path: "converter/MorseCode.tsx", var: "text", urlKey: "text" },
  { path: "converter/BaseEncoder.tsx", var: "input", urlKey: "text" },
  { path: "converter/RupiahWords.tsx", var: "val", urlKey: "n" },
  // ── Network ──
  { path: "network/UaParser.tsx", var: "ua", urlKey: "ua" },
  { path: "network/UrlParser.tsx", var: "input", urlKey: "url" },
  { path: "network/Ipv4Subnet.tsx", var: "input", urlKey: "cidr" },
  { path: "network/MetaTagGenerator.tsx", skipState: true }, // many fields
  { path: "network/OpenGraph.tsx", skipState: true }, // many fields
  { path: "network/RobotsTxt.tsx", skipState: true }, // rules array
  { path: "network/HtaccessRedirect.tsx", skipState: true }, // rules array
  { path: "network/CookieParser.tsx", var: "input", urlKey: "text" },
  { path: "network/UrlQuery.tsx", skipState: true }, // params array
  // ── Security ──
  { path: "security/ClassicalCiphers.tsx", var: "text", urlKey: "text" },
  { path: "security/LuhnChecker.tsx", var: "card", urlKey: "n" },
  { path: "security/JwtSigner.tsx", skipState: true }, // multi-field
  { path: "security/NikValidator.tsx", var: "nik", urlKey: "nik" },
  // ── Math ──
  { path: "math/MathEval.tsx", var: "exprs", urlKey: "expr" },
];

let totalDone = 0;
let totalSkipped = 0;

for (const t of TARGETS) {
  const file = join(ROOT, "src/tools", t.path);
  if (!existsSync(file)) {
    console.log(`✗ missing: ${t.path}`);
    continue;
  }
  let src = readFileSync(file, "utf8");
  const before = src;

  // 1. Add useUrlState import if not present
  if (!src.includes(`from "@/hooks/useUrlState"`)) {
    src = src.replace(
      /(import\s*\{\s*ToolShell\s*\}\s*from\s*"@\/components\/tool\/ToolShell";)/,
      `import { useUrlState } from "@/hooks/useUrlState";\n$1`
    );
  }

  // 2. Replace useState with useUrlState for the target variable
  if (!t.skipState) {
    const setName = "set" + t.var[0].toUpperCase() + t.var.slice(1);
    const re = new RegExp(
      `const\\s+\\[\\s*${t.var}\\s*,\\s*${setName}\\s*\\]\\s*=\\s*useState\\s*\\(([^)]*)\\)`,
      "m"
    );
    const m = src.match(re);
    if (m) {
      src = src.replace(re, `const [${t.var}, ${setName}] = useUrlState("${t.urlKey}", ${m[1]})`);
    }
    if (t.second) {
      const setName2 = "set" + t.second.var[0].toUpperCase() + t.second.var.slice(1);
      const re2 = new RegExp(
        `const\\s+\\[\\s*${t.second.var}\\s*,\\s*${setName2}\\s*\\]\\s*=\\s*useState\\s*\\(([^)]*)\\)`,
        "m"
      );
      const m2 = src.match(re2);
      if (m2) {
        src = src.replace(re2, `const [${t.second.var}, ${setName2}] = useUrlState("${t.second.urlKey}", ${m2[1]})`);
      }
    }
  }

  // 3. Add `shareable` prop to ToolShell
  if (!/shareable\s*\b/.test(src)) {
    // Try to insert before "actions={"
    if (/\n\s+actions=\{/.test(src)) {
      src = src.replace(/(\n\s+)actions=\{/, "$1shareable$1actions={");
    } else if (/<ToolShell\s/.test(src)) {
      // Insert before the closing > of the opening ToolShell tag
      src = src.replace(/(<ToolShell[\s\S]*?category=\{[^}]*\})(\s*>)/, "$1\n      shareable$2");
    }
  }

  if (src !== before) {
    writeFileSync(file, src, "utf8");
    totalDone++;
    console.log(`✔ ${t.path}`);
  } else {
    totalSkipped++;
    console.log(`= ${t.path} (no change)`);
  }
}

console.log(`\nDone: ${totalDone} updated, ${totalSkipped} skipped.`);
