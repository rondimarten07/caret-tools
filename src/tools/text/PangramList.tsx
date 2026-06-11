import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const PANGRAMS: { text: string; note: string }[] = [
  { text: "The quick brown fox jumps over the lazy dog.", note: "Classic — 35 letters, but uses some letters twice." },
  { text: "Pack my box with five dozen liquor jugs.", note: "32 letters — common in font-spec preview windows." },
  { text: "Sphinx of black quartz, judge my vow.", note: "29 letters — used by macOS Font Book." },
  { text: "How vexingly quick daft zebras jump!", note: "30 letters — clean and modern." },
  { text: "The five boxing wizards jump quickly.", note: "31 letters." },
  { text: "Jived fox nymph grabs quick waltz.", note: "28 letters — among the shortest." },
  { text: "Quick zephyrs blow, vexing daft Jim.", note: "29 letters." },
  { text: "Waltz, bad nymph, for quick jigs vex.", note: "28 letters — used by Windows Font preview." },
  { text: "Glib jocks quiz nymph to vex dwarf.", note: "28 letters — perfect for testing tightness." },
  { text: "Cwm fjord-bank glyphs vext quiz.", note: "26 letters — uses every letter exactly once." },
];

export default function PangramList() {
  return (
    <ToolShell title="Pangram Library" description="Curated pangrams — pick one for font specimens, hand-lettering, or type design." category={categoryMap.text}>
      <div className="space-y-3">
        {PANGRAMS.map((p) => (
          <Card key={p.text} className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-lg">{p.text}</p>
              <CopyButton value={p.text} />
            </div>
            <p className="text-xs text-muted-foreground">{p.note}</p>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
