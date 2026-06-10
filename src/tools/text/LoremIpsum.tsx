import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum"
    .split(" ");

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeSentence() {
  const len = randInt(6, 14);
  const w = Array.from({ length: len }, () => WORDS[randInt(0, WORDS.length - 1)]);
  w[0] = w[0][0].toUpperCase() + w[0].slice(1);
  return w.join(" ") + ".";
}

function makeParagraph(sentences: number) {
  return Array.from({ length: sentences }, makeSentence).join(" ");
}

type Unit = "paragraphs" | "sentences" | "words";

export default function LoremIpsum() {
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [count, setCount] = useState(3);
  const [seed, setSeed] = useState(0); // dummy state to retrigger

  const output = useMemo(() => {
    void seed;
    if (unit === "paragraphs") {
      return Array.from({ length: count }, () =>
        makeParagraph(randInt(4, 7))
      ).join("\n\n");
    }
    if (unit === "sentences") {
      return Array.from({ length: count }, makeSentence).join(" ");
    }
    const w = Array.from(
      { length: count },
      () => WORDS[randInt(0, WORDS.length - 1)]
    );
    w[0] = w[0][0].toUpperCase() + w[0].slice(1);
    return w.join(" ") + ".";
  }, [unit, count, seed]);

  return (
    <ToolShell
      title="Lorem Ipsum Generator"
      description="Generate placeholder text in paragraphs, sentences or words."
      category={categoryMap.text}
      actions={
        <>
          <CopyButton value={output} />
          <Button size="sm" onClick={() => setSeed((s) => s + 1)}>
            Regenerate
          </Button>
        </>
      }
    >
      <Card className="flex flex-wrap items-end gap-3 p-3">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Generate</Label>
          <div className="flex gap-2">
            {(["paragraphs", "sentences", "words"] as Unit[]).map((u) => (
              <Button
                key={u}
                size="sm"
                variant={unit === u ? "default" : "outline"}
                onClick={() => setUnit(u)}
              >
                {u}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Count</Label>
          <Input
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(e) =>
              setCount(Math.max(1, Math.min(500, Number(e.target.value) || 1)))
            }
            className="w-24"
          />
        </div>
      </Card>

      <Card className="p-3">
        <Textarea
          readOnly
          value={output}
          className="min-h-[360px] bg-muted/30 font-sans"
        />
      </Card>
    </ToolShell>
  );
}
