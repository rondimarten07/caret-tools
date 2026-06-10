import { useEffect, useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";
import { Pause, Play, RotateCcw, Flag } from "lucide-react";

function fmt(ms: number): string {
  const total = Math.floor(ms);
  const h = Math.floor(total / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const cs = Math.floor((total % 1000) / 10);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const base = Date.now() - elapsed;
    startRef.current = base;
    const tick = () => {
      setElapsed(Date.now() - startRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  };

  return (
    <ToolShell
      title="Stopwatch"
      description="Simple stopwatch with lap support."
      category={categoryMap.time}
    >
      <Card className="flex flex-col items-center gap-6 p-6">
        <div className="font-mono text-5xl tabular-nums md:text-7xl">{fmt(elapsed)}</div>
        <div className="flex gap-2">
          <Button onClick={() => setRunning((v) => !v)} className="min-w-28">
            {running ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {running ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" onClick={() => setLaps((l) => [...l, elapsed])} disabled={!running}>
            <Flag className="mr-2 h-4 w-4" />
            Lap
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </Card>
      {laps.length > 0 && (
        <Card className="p-3">
          <ul className="divide-y font-mono text-sm">
            {laps.map((l, i) => (
              <li key={i} className="flex justify-between py-2">
                <span className="text-muted-foreground">Lap {i + 1}</span>
                <span>{fmt(l)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </ToolShell>
  );
}
