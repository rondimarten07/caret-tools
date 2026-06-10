import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useCopy } from "@/hooks/useCopy";
import { categoryMap } from "@/data/categories";

// Subset of 200+ most common GitHub emoji shortcodes
const EMOJI: { code: string; emoji: string }[] = [
  { code: "fire", emoji: "🔥" }, { code: "rocket", emoji: "🚀" }, { code: "tada", emoji: "🎉" },
  { code: "sparkles", emoji: "✨" }, { code: "+1", emoji: "👍" }, { code: "-1", emoji: "👎" },
  { code: "100", emoji: "💯" }, { code: "heart", emoji: "❤️" }, { code: "eyes", emoji: "👀" },
  { code: "smile", emoji: "😄" }, { code: "joy", emoji: "😂" }, { code: "thinking", emoji: "🤔" },
  { code: "facepalm", emoji: "🤦" }, { code: "shrug", emoji: "🤷" }, { code: "wave", emoji: "👋" },
  { code: "pray", emoji: "🙏" }, { code: "clap", emoji: "👏" }, { code: "muscle", emoji: "💪" },
  { code: "ok", emoji: "👌" }, { code: "warning", emoji: "⚠️" }, { code: "construction", emoji: "🚧" },
  { code: "bug", emoji: "🐛" }, { code: "wrench", emoji: "🔧" }, { code: "hammer", emoji: "🔨" },
  { code: "art", emoji: "🎨" }, { code: "package", emoji: "📦" }, { code: "lock", emoji: "🔒" },
  { code: "unlock", emoji: "🔓" }, { code: "key", emoji: "🔑" }, { code: "bookmark", emoji: "🔖" },
  { code: "pencil", emoji: "✏️" }, { code: "memo", emoji: "📝" }, { code: "books", emoji: "📚" },
  { code: "book", emoji: "📖" }, { code: "mag", emoji: "🔍" }, { code: "telescope", emoji: "🔭" },
  { code: "bulb", emoji: "💡" }, { code: "zap", emoji: "⚡" }, { code: "boom", emoji: "💥" },
  { code: "fire_engine", emoji: "🚒" }, { code: "ambulance", emoji: "🚑" }, { code: "alien", emoji: "👽" },
  { code: "robot", emoji: "🤖" }, { code: "ghost", emoji: "👻" }, { code: "skull", emoji: "💀" },
  { code: "poop", emoji: "💩" }, { code: "shipit", emoji: "🚢" }, { code: "ship", emoji: "🚢" },
  { code: "rotating_light", emoji: "🚨" }, { code: "white_check_mark", emoji: "✅" },
  { code: "x", emoji: "❌" }, { code: "no_entry", emoji: "⛔" }, { code: "question", emoji: "❓" },
  { code: "exclamation", emoji: "❗" }, { code: "information_source", emoji: "ℹ️" },
  { code: "checkered_flag", emoji: "🏁" }, { code: "trophy", emoji: "🏆" }, { code: "medal", emoji: "🏅" },
  { code: "crown", emoji: "👑" }, { code: "gem", emoji: "💎" }, { code: "moneybag", emoji: "💰" },
  { code: "calendar", emoji: "📅" }, { code: "clock1", emoji: "🕐" }, { code: "stopwatch", emoji: "⏱️" },
  { code: "hourglass", emoji: "⏳" }, { code: "tv", emoji: "📺" }, { code: "computer", emoji: "💻" },
  { code: "iphone", emoji: "📱" }, { code: "camera", emoji: "📷" }, { code: "headphones", emoji: "🎧" },
  { code: "musical_note", emoji: "🎵" }, { code: "guitar", emoji: "🎸" }, { code: "drum", emoji: "🥁" },
  { code: "speech_balloon", emoji: "💬" }, { code: "thought_balloon", emoji: "💭" },
  { code: "email", emoji: "📧" }, { code: "envelope", emoji: "✉️" }, { code: "bell", emoji: "🔔" },
  { code: "no_bell", emoji: "🔕" }, { code: "tag", emoji: "🏷️" }, { code: "label", emoji: "🏷️" },
  { code: "link", emoji: "🔗" }, { code: "paperclip", emoji: "📎" }, { code: "scissors", emoji: "✂️" },
  { code: "speech_left", emoji: "🗨️" }, { code: "earth_americas", emoji: "🌎" }, { code: "earth_asia", emoji: "🌏" },
  { code: "globe_with_meridians", emoji: "🌐" }, { code: "rainbow", emoji: "🌈" }, { code: "umbrella", emoji: "☂️" },
  { code: "snowflake", emoji: "❄️" }, { code: "sunny", emoji: "☀️" }, { code: "cloud", emoji: "☁️" },
  { code: "star", emoji: "⭐" }, { code: "star2", emoji: "🌟" }, { code: "dizzy", emoji: "💫" },
  { code: "cat", emoji: "🐱" }, { code: "dog", emoji: "🐶" }, { code: "panda", emoji: "🐼" },
  { code: "fox", emoji: "🦊" }, { code: "lion", emoji: "🦁" }, { code: "tiger", emoji: "🐯" },
  { code: "wolf", emoji: "🐺" }, { code: "bear", emoji: "🐻" }, { code: "rabbit", emoji: "🐰" },
];

export default function GithubEmoji() {
  const { copy } = useCopy();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return EMOJI;
    return EMOJI.filter((e) => e.code.includes(s));
  }, [q]);

  return (
    <ToolShell title="GitHub Emoji" description="Searchable GitHub :shortcode: emoji picker. Click to copy the shortcode." category={categoryMap.text}>
      <Input placeholder="Search shortcode: fire, rocket, +1…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filtered.map((e) => (
          <Card key={e.code} className="flex items-center gap-2 p-2">
            <button onClick={() => copy(e.emoji, `${e.emoji} copied`)} className="text-2xl hover:scale-110 transition-transform">
              {e.emoji}
            </button>
            <button onClick={() => copy(`:${e.code}:`, `:${e.code}: copied`)} className="flex-1 truncate text-left font-mono text-xs text-muted-foreground hover:text-foreground">
              :{e.code}:
            </button>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
