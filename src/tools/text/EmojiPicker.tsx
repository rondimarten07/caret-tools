import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useCopy } from "@/hooks/useCopy";
import { categoryMap } from "@/data/categories";

const EMOJI: { emoji: string; name: string; group: string }[] = [
  // Smileys
  { emoji: "😀", name: "grinning face", group: "Smileys" },
  { emoji: "😃", name: "grinning face with big eyes", group: "Smileys" },
  { emoji: "😄", name: "grinning face with smiling eyes", group: "Smileys" },
  { emoji: "😁", name: "beaming face", group: "Smileys" },
  { emoji: "😆", name: "grinning squinting", group: "Smileys" },
  { emoji: "🥰", name: "smiling face with hearts", group: "Smileys" },
  { emoji: "😍", name: "heart eyes", group: "Smileys" },
  { emoji: "🤩", name: "star-struck", group: "Smileys" },
  { emoji: "😘", name: "kissing", group: "Smileys" },
  { emoji: "😎", name: "cool", group: "Smileys" },
  { emoji: "🤓", name: "nerd", group: "Smileys" },
  { emoji: "🥳", name: "party", group: "Smileys" },
  { emoji: "🤔", name: "thinking", group: "Smileys" },
  { emoji: "😴", name: "sleeping", group: "Smileys" },
  { emoji: "🤯", name: "exploding head", group: "Smileys" },
  { emoji: "🥺", name: "pleading", group: "Smileys" },
  { emoji: "😭", name: "loudly crying", group: "Smileys" },
  { emoji: "😡", name: "angry", group: "Smileys" },
  { emoji: "🤬", name: "cursing", group: "Smileys" },
  { emoji: "🥶", name: "cold", group: "Smileys" },
  // Gestures
  { emoji: "👍", name: "thumbs up", group: "Gestures" },
  { emoji: "👎", name: "thumbs down", group: "Gestures" },
  { emoji: "👋", name: "wave", group: "Gestures" },
  { emoji: "🙌", name: "raised hands", group: "Gestures" },
  { emoji: "🙏", name: "praying", group: "Gestures" },
  { emoji: "👏", name: "clap", group: "Gestures" },
  { emoji: "🤝", name: "handshake", group: "Gestures" },
  { emoji: "💪", name: "muscle", group: "Gestures" },
  { emoji: "🫡", name: "salute", group: "Gestures" },
  { emoji: "🤞", name: "fingers crossed", group: "Gestures" },
  { emoji: "✌️", name: "victory", group: "Gestures" },
  { emoji: "🤘", name: "rock on", group: "Gestures" },
  { emoji: "👌", name: "ok", group: "Gestures" },
  // Hearts
  { emoji: "❤️", name: "red heart", group: "Hearts" },
  { emoji: "🧡", name: "orange heart", group: "Hearts" },
  { emoji: "💛", name: "yellow heart", group: "Hearts" },
  { emoji: "💚", name: "green heart", group: "Hearts" },
  { emoji: "💙", name: "blue heart", group: "Hearts" },
  { emoji: "💜", name: "purple heart", group: "Hearts" },
  { emoji: "🖤", name: "black heart", group: "Hearts" },
  { emoji: "🤍", name: "white heart", group: "Hearts" },
  { emoji: "💔", name: "broken heart", group: "Hearts" },
  // Symbols
  { emoji: "🔥", name: "fire", group: "Symbols" },
  { emoji: "✨", name: "sparkles", group: "Symbols" },
  { emoji: "⭐", name: "star", group: "Symbols" },
  { emoji: "🌟", name: "glowing star", group: "Symbols" },
  { emoji: "💯", name: "hundred", group: "Symbols" },
  { emoji: "⚡", name: "zap lightning", group: "Symbols" },
  { emoji: "💡", name: "idea bulb", group: "Symbols" },
  { emoji: "🎉", name: "tada party", group: "Symbols" },
  { emoji: "🎊", name: "confetti", group: "Symbols" },
  { emoji: "✅", name: "check", group: "Symbols" },
  { emoji: "❌", name: "cross x", group: "Symbols" },
  { emoji: "⚠️", name: "warning", group: "Symbols" },
  { emoji: "❓", name: "question", group: "Symbols" },
  { emoji: "❗", name: "exclamation", group: "Symbols" },
  // Tech
  { emoji: "💻", name: "laptop", group: "Tech" },
  { emoji: "🖥️", name: "desktop", group: "Tech" },
  { emoji: "📱", name: "mobile phone", group: "Tech" },
  { emoji: "⌨️", name: "keyboard", group: "Tech" },
  { emoji: "🖱️", name: "mouse", group: "Tech" },
  { emoji: "🖨️", name: "printer", group: "Tech" },
  { emoji: "📷", name: "camera", group: "Tech" },
  { emoji: "🔋", name: "battery", group: "Tech" },
  { emoji: "🔌", name: "plug", group: "Tech" },
  { emoji: "🛠️", name: "tools", group: "Tech" },
  { emoji: "🚀", name: "rocket", group: "Tech" },
  { emoji: "🤖", name: "robot", group: "Tech" },
];

const GROUPS = Array.from(new Set(EMOJI.map((e) => e.group)));

export default function EmojiPicker() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string>("All");
  const { copy } = useCopy();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return EMOJI.filter((e) => (group === "All" || e.group === group) && (!s || e.name.includes(s)));
  }, [q, group]);

  return (
    <ToolShell title="Emoji Picker" description="Searchable emoji picker — click to copy." category={categoryMap.text}>
      <Card className="space-y-3 p-3">
        <Input placeholder="Search by name (e.g. fire, heart, thumbs)…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex flex-wrap gap-1.5 text-xs">
          {["All", ...GROUPS].map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`rounded-md border px-2 py-1 ${
                group === g ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </Card>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-12">
        {filtered.map((e) => (
          <button
            key={e.emoji}
            onClick={() => copy(e.emoji, `${e.emoji} ${e.name} copied`)}
            title={e.name}
            className="grid aspect-square place-items-center rounded-md border bg-card text-2xl transition-transform hover:scale-110 hover:border-primary/40"
          >
            {e.emoji}
          </button>
        ))}
      </div>
    </ToolShell>
  );
}
