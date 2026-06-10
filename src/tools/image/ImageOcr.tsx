import { useState } from "react";
import Tesseract from "tesseract.js";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const LANGS = [
  { id: "eng", name: "English" },
  { id: "ind", name: "Indonesian" },
  { id: "jpn", name: "Japanese" },
  { id: "chi_sim", name: "Chinese (simplified)" },
  { id: "kor", name: "Korean" },
  { id: "rus", name: "Russian" },
  { id: "ara", name: "Arabic" },
  { id: "spa", name: "Spanish" },
  { id: "fra", name: "French" },
  { id: "deu", name: "German" },
];

export default function ImageOcr() {
  const [src, setSrc] = useState<string | null>(null);
  const [lang, setLang] = useState("eng");
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const run = async () => {
    if (!src) return;
    setBusy(true);
    setErr("");
    setText("");
    setProgress(0);
    try {
      const { data } = await Tesseract.recognize(src, lang, {
        logger: (m) => {
          if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
        },
      });
      setText(data.text);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell title="Image OCR" description="Extract text from images using Tesseract.js. Runs entirely in your browser (first run downloads the language model)." category={categoryMap.image}>
      <Card className="space-y-3 p-3">
        <Input type="file" accept="image/*" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setSrc(URL.createObjectURL(f));
        }} />
        <div className="flex items-center gap-2">
          <Label className="text-xs">Language</Label>
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
            {LANGS.map((l) => (<option key={l.id} value={l.id}>{l.name}</option>))}
          </select>
          <Button onClick={run} disabled={!src || busy} className="ml-auto">
            {busy ? `Recognizing… ${progress}%` : "Recognize"}
          </Button>
        </div>
      </Card>
      {src && (
        <Card className="grid place-items-center p-3">
          <img src={src} alt="" className="max-h-72 rounded-md border" />
        </Card>
      )}
      {(text || err) && (
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{err ? "Error" : "Text"}</Label>
            {!err && <CopyButton value={text} />}
          </div>
          {err ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{err}</div>
          ) : (
            <Textarea readOnly value={text} className="min-h-[260px] bg-muted/30" />
          )}
        </Card>
      )}
    </ToolShell>
  );
}
