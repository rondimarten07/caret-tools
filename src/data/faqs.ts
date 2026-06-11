/**
 * Optional FAQ entries per tool. The SoftwareApplication+BreadcrumbList
 * JSON-LD always emits; this file lets specific tools add an extra
 * FAQPage schema for richer search appearance.
 *
 * Keep entries concise (1-2 short sentences each). Real questions only.
 */

export type Faq = { q: string; a: string };

export const FAQS: Record<string, Faq[]> = {
  "json-formatter": [
    { q: "Is my JSON sent to a server?", a: "No. All parsing and formatting happens in your browser; nothing is uploaded." },
    { q: "Can I share my formatted JSON with a colleague?", a: "Yes. Click Share — your input is encoded into the URL so the link reproduces the same state." },
    { q: "Why does my JSON show as invalid?", a: "Common causes: trailing commas, unquoted keys, or single quotes. JSON requires double quotes and no trailing commas." },
  ],
  "base64": [
    { q: "Is this Base64 tool URL-safe?", a: "It uses standard Base64. For URL-safe Base64, replace + with - and / with _ after encoding." },
    { q: "Does it handle Unicode?", a: "Yes. The encoder is UTF-8 safe — emoji and non-Latin characters work correctly." },
  ],
  "url-encoder": [
    { q: "What's the difference between encodeURI and encodeURIComponent?", a: "This tool uses encodeURIComponent, which percent-encodes every reserved character — the safer choice for query parameters." },
  ],
  "jwt-decoder": [
    { q: "Does this verify the JWT signature?", a: "No. This tool only decodes the header and payload. Use the JWT Signer tool to sign or verify a JWT." },
    { q: "Are my tokens uploaded anywhere?", a: "No. Decoding happens entirely in your browser." },
  ],
  "uuid-generator": [
    { q: "Which UUID version is generated?", a: "Version 4, generated from a cryptographically secure random source (crypto.randomUUID or getRandomValues)." },
    { q: "Are these UUIDs collision-safe?", a: "Yes. v4 UUIDs have 122 random bits — the chance of collision is negligible for any realistic use case." },
  ],
  "hash-generator": [
    { q: "Which hash algorithms are supported?", a: "MD5, SHA-1, SHA-256, SHA-384, and SHA-512. For modern security, prefer SHA-256 or higher." },
    { q: "Should I use MD5 for passwords?", a: "No. MD5 and SHA-1 are not suitable for password hashing. Use the Bcrypt tool instead." },
  ],
  "password-generator": [
    { q: "Are the passwords random and secure?", a: "Yes. They are generated using crypto.getRandomValues, a cryptographically secure source." },
    { q: "Are my generated passwords logged?", a: "No. Generation happens entirely in your browser; nothing is stored or transmitted." },
  ],
  "qr-code-generator": [
    { q: "Can I add a logo to the QR code?", a: "Not yet — but you can adjust error correction (use H) and overlay your own logo in any image editor." },
    { q: "What's the largest text I can encode?", a: "QR codes support up to 4296 alphanumeric characters or 2953 bytes, depending on the error correction level." },
  ],
  "color-picker": [
    { q: "Can I share a specific color?", a: "Yes. Click Share — the HEX value is encoded into the URL." },
  ],
  "regex-tester": [
    { q: "Which regex flavor does this support?", a: "JavaScript regex (ECMAScript). Some Perl/PHP/Go-only features may not work." },
    { q: "Can I share a pattern and test text together?", a: "Yes. Click Share — both pattern and text are encoded into the URL." },
  ],
  "image-ocr": [
    { q: "Does the OCR work offline?", a: "After the first run, the language model is cached and OCR runs entirely offline in your browser." },
    { q: "Why is the first run slow?", a: "Tesseract downloads the language model (a few MB) on first use. Subsequent recognitions are much faster." },
  ],
  "totp-generator": [
    { q: "Is this compatible with Google Authenticator?", a: "Yes. Scan the provisioning QR code with any TOTP app (Authy, Google Authenticator, 1Password)." },
    { q: "Where is my secret stored?", a: "Only in the URL of this page. Bookmarking the page reproduces the secret; closing the tab forgets it." },
  ],
  "bip39-mnemonic": [
    { q: "Are these mnemonics safe to use for a real wallet?", a: "Generated entropy is cryptographically secure, but only use phrases generated on a fully trusted device for real funds." },
    { q: "What is the optional passphrase?", a: "BIP39's '13th word'. The same mnemonic with a different passphrase derives a different wallet." },
  ],
  "nik-validator": [
    { q: "Does this tool store my NIK?", a: "No. Validation runs locally in your browser; nothing is sent or logged." },
    { q: "What does the tool detect?", a: "Province, regency code, district code, date of birth, and gender (derived from day + 40 = female)." },
  ],
  "json5-converter": [
    { q: "What is JSON5?", a: "JSON5 is a superset of JSON that allows comments, trailing commas, unquoted keys, and single-quoted strings — easier for humans to write." },
  ],
  "json-to-go": [
    { q: "Can I share the JSON I'm converting?", a: "Yes — click Share. The JSON is encoded into the URL hash." },
  ],
  "ndjson-viewer": [
    { q: "What is NDJSON?", a: "Newline-Delimited JSON. Each line is a complete JSON value. Common for log files and streaming." },
  ],
  "pem-inspector": [
    { q: "Does this tool send my keys anywhere?", a: "No. Parsing happens entirely in your browser. Still — never paste a real private key into any web tool you don't fully trust." },
  ],
  "color-blindness": [
    { q: "How accurate is this simulation?", a: "It uses standard sRGB matrices that approximate dichromatic vision. Real color vision deficiency is more complex; use this as a rough guide." },
  ],
  "readability": [
    { q: "Which score should I trust?", a: "All three give a rough sense — Flesch Reading Ease is most cited; the Kincaid grade level is easiest to interpret (≈ US school grade)." },
  ],
  "compound-interest": [
    { q: "Are taxes and inflation included?", a: "No. The calculation is nominal — adjust manually for taxes (subtract 15-30%) and inflation (subtract 2-3% per year for real return)." },
  ],
  "statistics": [
    { q: "Can I share my dataset?", a: "Yes — click Share. The numbers are encoded into the URL hash." },
    { q: "What is mode when there's no repetition?", a: "If no number repeats, the mode is undefined (shown as —). Mean and median still work." },
  ],
  "sleep-cycle": [
    { q: "Why 90-minute cycles?", a: "An average sleep cycle (light → deep → REM) is about 90 minutes. Waking at the end of a cycle feels less groggy than mid-cycle." },
  ],
  "passport-validator": [
    { q: "Does this verify the passport is real?", a: "No — it only checks the FORMAT against the country's known pattern. A real validation requires the issuing authority." },
  ],
  "sitemap-generator": [
    { q: "What changefreq and priority should I use?", a: "Modern search engines mostly ignore these. Defaults are fine. The important parts are <loc> and <lastmod>." },
  ],
  "svg-to-react": [
    { q: "Does it handle complex SVG with gradients?", a: "Most cases yes — common attrs are camelCased. For advanced cases (filter URL refs, embedded scripts) you may need manual cleanup." },
  ],
  "css-specificity": [
    { q: "Why do my styles get overridden?", a: "The selector with higher specificity wins, regardless of source order. Use this tool to compare and find the culprit." },
  ],
  "diff-viewer": [
    { q: "Can I paste output from git diff?", a: "Yes — copy git diff output as-is, including the diff/index/--- /+++ headers." },
  ],
  "cubic-bezier": [
    { q: "What's the difference between 'ease-in-out' and a custom curve?", a: "Built-in keywords map to specific cubic-bezier values. Custom curves give finer control — e.g. overshoot for playful UI." },
  ],
  "box-model": [
    { q: "Does box-sizing change this?", a: "Yes — with box-sizing: border-box, padding and border are subtracted from width/height instead of added. This tool shows the default content-box behavior." },
  ],
  "uuid-v7": [
    { q: "When should I use v7 instead of v4?", a: "Use v7 when sorting matters (database primary keys, sortable IDs). v4 is fine for completely random IDs without ordering needs." },
  ],
  "isbn-validator": [
    { q: "What about the X in old ISBNs?", a: "ISBN-10 uses X for check digit value 10 (since check is mod 11). This tool handles X correctly." },
  ],
  "id-phone-validator": [
    { q: "Does this verify the number is real or active?", a: "No — it only validates FORMAT and identifies the likely carrier from the prefix. Real-time verification requires the operator's API." },
  ],
  "image-to-ico": [
    { q: "Why multiple sizes in one .ico?", a: "Operating systems pick the best size for context (taskbar uses 16, alt-tab uses 32). Multi-size .ico means crisp icons everywhere." },
  ],
  "frontmatter-editor": [
    { q: "Compatible with which static site generators?", a: "Standard YAML frontmatter works with Hugo, Astro, Next.js, Gatsby, Jekyll, Eleventy, and most others." },
  ],
  "caesar-brute": [
    { q: "Why try all shifts?", a: "Caesar cipher only has 25 useful shifts. Brute-forcing every one is faster than guessing — the readable line is the answer." },
  ],
  "test-card-numbers": [
    { q: "Can I use these in production?", a: "No. These numbers only work in sandbox/test mode of payment processors like Stripe. Real charges will be rejected." },
    { q: "Why do they pass Luhn?", a: "They're designed to look like valid cards so test forms accept them, but the issuer ranges are reserved for testing only." },
  ],
  "currency-symbols": [
    { q: "Are these all official?", a: "Yes — codes are ISO 4217. Symbols reflect common everyday use; some currencies share glyphs (e.g. $, ¥)." },
  ],
  "image-probe": [
    { q: "Is my image uploaded?", a: "No. Dimensions and metadata are read locally via the browser — the file never leaves your device." },
  ],
  "roman-year": [
    { q: "Why only 1–3999?", a: "Standard Roman numerals stop at MMMCMXCIX (3999). Larger numbers historically used vinculum (overlines), which isn't represented here." },
  ],
  "jwt-debugger": [
    { q: "Does this verify the signature?", a: "No — it only decodes and analyzes claims (exp, nbf, iat). Use the JWT Signer tool for verification." },
  ],
  "http-headers": [
    { q: "Is this exhaustive?", a: "No — it covers the most common ~25 headers you'll encounter day-to-day. Refer to MDN for the full list." },
  ],
  "cidr-expander": [
    { q: "Why is there a 4096-IP cap?", a: "To keep the browser responsive. For larger ranges, use a CLI tool — listing /16 means 65k rows." },
  ],
  "mac-generator": [
    { q: "What is the locally administered bit?", a: "Bit 1 of the first octet — set means the MAC is locally assigned (not from a hardware vendor). Useful for virtual interfaces." },
  ],
  "hex-binary": [
    { q: "Why is each hex digit four binary digits?", a: "Hexadecimal is base-16; 16 = 2⁴, so each hex digit cleanly maps to a 4-bit nibble." },
  ],
  "ip-to-int": [
    { q: "Why convert IPs to integers?", a: "Database indexes, ACL ranges, and arithmetic comparisons are all faster on integers than on text addresses." },
  ],
  "braille": [
    { q: "Is this real Braille?", a: "It's Grade 1 Unified English Braille (letter-for-letter). Grade 2 contractions and language-specific systems are not included." },
  ],
  "probability": [
    { q: "What's the difference between nPr and nCr?", a: "nPr (permutation) counts ordered arrangements; nCr (combination) counts unordered selections. nCr = nPr / r!." },
  ],
  "triangle-solver": [
    { q: "What method does it use?", a: "Law of cosines for angles, then Heron's formula for area. Accuracy is limited by floating-point — extreme angles can lose precision." },
  ],
  "polygon-area": [
    { q: "Does the polygon need to be convex?", a: "No. The shoelace formula works for any simple (non-self-intersecting) polygon, convex or concave." },
  ],
  "vigenere": [
    { q: "Is this cryptographically secure?", a: "No — Vigenère is a classical cipher, broken by frequency analysis (Kasiski/Friedman). Use it for puzzles, not secrets." },
  ],
  "rot-n": [
    { q: "Why is ROT13 popular?", a: "It's its own inverse and obscures text without protecting it — good for spoiler hiding, joke punchlines, Usenet etiquette." },
  ],
  "line-endings": [
    { q: "Which line ending should I use?", a: "LF on Unix/macOS/web, CRLF on Windows. Most modern editors and git's autocrlf handle this transparently." },
  ],
  "bom-remover": [
    { q: "Why is a BOM problematic?", a: "Some tools (shell scripts, JSON parsers, JS modules) don't expect it and break on the leading U+FEFF byte." },
  ],
  "iso8601": [
    { q: "Why prefer ISO 8601?", a: "It sorts lexicographically as it does chronologically, includes the timezone offset, and is unambiguous across locales." },
  ],
  "year-progress": [
    { q: "When does the week start?", a: "ISO standard: Monday. The week bar tracks Mon–Sun of the current week." },
  ],
  "ip-class": [
    { q: "Are classes still used?", a: "No — modern routing is classless (CIDR). The labels remain useful for quick reads and for understanding default masks in legacy gear." },
  ],
  "license-snippet": [
    { q: "Is the generated text legally sufficient?", a: "It mirrors the canonical license text. Always read the full license to confirm it suits your use case." },
  ],
  "apikey-format": [
    { q: "Can I use these in production?", a: "No — these are random strings shaped to look like real keys. They won't authenticate against any service. Generate via your provider's dashboard." },
  ],
};
