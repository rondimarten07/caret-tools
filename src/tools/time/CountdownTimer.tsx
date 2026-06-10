import { useEffect, useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Pause, Play, RotateCcw } from "lucide-react";

function fmt(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CountdownTimer() {
  const [h, setH] = useState(0);
  const [m, setM] = useState(5);
  const [s, setS] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1000)), 250);
    ref.current = t as unknown as number;
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (running && remaining === 0) {
      setRunning(false);
      new Audio("data:audio/wav;base64,UklGRoQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YYAAAAB+fn5+fn5+fn4=").play().catch(() => {});
    }
  }, [running, remaining]);

  const start = () => {
    if (remaining === 0) setRemaining(((h * 60 + m) * 60 + s) * 1000);
    setRunning(true);
  };
  const reset = () => { setRunning(false); setRemaining(0); };

  return (
    <ToolShell title="Countdown Timer" description="Counts down to zero with an end alert." category={categoryMap.time}>
      <Card className="grid grid-cols-3 gap-2 p-3">
        <div><Label className="text-xs">Hours</Label><Input type="number" min={0} value={h} onChange={(e) => setH(Number(e.target.value) || 0)} /></div>
        <div><Label className="text-xs">Minutes</Label><Input type="number" min={0} max={59} value={m} onChange={(e) => setM(Number(e.target.value) || 0)} /></div>
        <div><Label className="text-xs">Seconds</Label><Input type="number" min={0} max={59} value={s} onChange={(e) => setS(Number(e.target.value) || 0)} /></div>
      </Card>
      <Card className="flex flex-col items-center gap-4 p-6">
        <div className="font-mono text-6xl tabular-nums md:text-7xl">{fmt(remaining)}</div>
        <div className="flex gap-2">
          <Button onClick={() => { if (!running) start(); else setRunning(false); }}>
            {running ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {running ? "Pause" : "Start"}
          </Button>
          <Button variant="ghost" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
        </div>
      </Card>
    </ToolShell>
  );
}
