import { useEffect, useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

type Mode = "focus" | "short" | "long";

const MODE_LABEL: Record<Mode, string> = {
  focus: "Focus",
  short: "Short break",
  long: "Long break",
};

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function chime() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.8);
  } catch {
    /* ignore */
  }
}

export default function Pomodoro() {
  const [focusMin, setFocusMin] = useState(25);
  const [shortMin, setShortMin] = useState(5);
  const [longMin, setLongMin] = useState(15);
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const ref = useRef<number | null>(null);

  const total = mode === "focus" ? focusMin * 60 : mode === "short" ? shortMin * 60 : longMin * 60;

  // Reset timer when mode or duration changes
  useEffect(() => {
    setRemaining(total);
    setRunning(false);
  }, [mode, focusMin, shortMin, longMin]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          setRunning(false);
          chime();
          if (mode === "focus") {
            setCompleted((n) => n + 1);
            setMode((n) => ((completed + 1) % 4 === 0 ? "long" : "short"));
          } else {
            setMode("focus");
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    ref.current = t as unknown as number;
    return () => clearInterval(t);
  }, [running, mode, completed]);

  const reset = () => {
    setRunning(false);
    setRemaining(total);
  };

  const skip = () => {
    setRunning(false);
    setRemaining(0);
    setTimeout(() => {
      if (mode === "focus") {
        setCompleted((n) => n + 1);
        setMode((completed + 1) % 4 === 0 ? "long" : "short");
      } else {
        setMode("focus");
      }
    }, 50);
  };

  const pct = (1 - remaining / total) * 100;

  return (
    <ToolShell title="Pomodoro Timer" description="Classic 25/5 focus + break cycles. Audio chime at end of session." category={categoryMap.time}>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        {(["focus", "short", "long"] as Mode[]).map((m) => (
          <Button key={m} size="sm" variant={mode === m ? "default" : "outline"} onClick={() => setMode(m)}>
            {MODE_LABEL[m]}
          </Button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">Completed: <b>{completed}</b></span>
      </Card>

      <Card className="flex flex-col items-center gap-4 p-6">
        <div className="font-mono text-7xl tabular-nums">{fmt(remaining)}</div>
        <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setRunning((v) => !v)} className="min-w-24">
            {running ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {running ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
          <Button variant="ghost" onClick={skip}><SkipForward className="mr-2 h-4 w-4" />Skip</Button>
        </div>
      </Card>

      <Card className="grid grid-cols-3 gap-3 p-3">
        <div>
          <Label className="text-xs">Focus (min)</Label>
          <Input type="number" min={1} value={focusMin} onChange={(e) => setFocusMin(Math.max(1, Number(e.target.value) || 25))} />
        </div>
        <div>
          <Label className="text-xs">Short break</Label>
          <Input type="number" min={1} value={shortMin} onChange={(e) => setShortMin(Math.max(1, Number(e.target.value) || 5))} />
        </div>
        <div>
          <Label className="text-xs">Long break</Label>
          <Input type="number" min={1} value={longMin} onChange={(e) => setLongMin(Math.max(1, Number(e.target.value) || 15))} />
        </div>
      </Card>
    </ToolShell>
  );
}
