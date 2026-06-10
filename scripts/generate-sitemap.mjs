#!/usr/bin/env node
/**
 * Generate sitemap.xml and robots.txt into public/
 * Runs as a `postbuild` step. Reads the tool registry by parsing
 * src/data/tools.ts for slug/category fields (no TS runtime needed).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITE = process.env.SITE_URL || "https://tools.example.com";

const toolsSrc = readFileSync(join(ROOT, "src/data/tools.ts"), "utf8");
const categoriesSrc = readFileSync(join(ROOT, "src/data/categories.ts"), "utf8");

const slugs = Array.from(toolsSrc.matchAll(/slug:\s*"([^"]+)"/g), (m) => m[1]);
const categoryIds = Array.from(
  categoriesSrc.matchAll(/id:\s*"([a-z]+)"/g),
  (m) => m[1]
);

const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${SITE}/`, priority: "1.0", changefreq: "weekly" },
  { loc: `${SITE}/favorites`, priority: "0.4", changefreq: "monthly" },
  ...categoryIds.map((id) => ({
    loc: `${SITE}/category/${id}`,
    priority: "0.7",
    changefreq: "monthly",
  })),
  ...slugs.map((slug) => ({
    loc: `${SITE}/tool/${slug}`,
    priority: "0.6",
    changefreq: "monthly",
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

// Write to dist/ (post-build) AND public/ (for dev)
const targets = [join(ROOT, "dist"), join(ROOT, "public")];
for (const dir of targets) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "sitemap.xml"), xml);
  writeFileSync(join(dir, "robots.txt"), robots);
}

console.log(
  `✔ Generated sitemap with ${urls.length} URLs (${slugs.length} tools, ${categoryIds.length} categories)`
);
