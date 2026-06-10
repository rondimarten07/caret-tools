import { useState } from "react";
import bcrypt from "bcryptjs";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function BcryptHash() {
  const [password, setPassword] = useState("");
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState("");

  const [verifyPw, setVerifyPw] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<"match" | "no-match" | null>(null);

  const [busy, setBusy] = useState(false);

  const generate = async () => {
    if (!password) return;
    setBusy(true);
    try {
      setHash(await bcrypt.hash(password, rounds));
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setVerifyResult(null);
    if (!verifyPw || !verifyHash) return;
    try {
      const ok = await bcrypt.compare(verifyPw, verifyHash);
      setVerifyResult(ok ? "match" : "no-match");
    } catch {
      setVerifyResult("no-match");
    }
  };

  return (
    <ToolShell title="Bcrypt Hash" description="Generate and verify bcrypt password hashes." category={categoryMap.security}>
      <Card className="space-y-3 p-3">
        <Label className="text-base">Generate</Label>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_160px]">
          <div>
            <Label className="text-xs">Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          </div>
          <div>
            <Label className="text-xs">Rounds</Label>
            <Input type="number" min={4} max={14} value={rounds} onChange={(e) => setRounds(Math.max(4, Math.min(14, Number(e.target.value) || 10)))} />
          </div>
        </div>
        <Button onClick={generate} disabled={!password || busy}>{busy ? "Hashing…" : "Generate"}</Button>
        {hash && (
          <div className="flex items-center gap-2">
            <code className="flex-1 break-all rounded-md bg-muted/30 p-3 font-mono text-xs">{hash}</code>
            <CopyButton value={hash} />
          </div>
        )}
      </Card>

      <Card className="space-y-3 p-3">
        <Label className="text-base">Verify</Label>
        <div>
          <Label className="text-xs">Password</Label>
          <Input value={verifyPw} onChange={(e) => setVerifyPw(e.target.value)} type="password" />
        </div>
        <div>
          <Label className="text-xs">Hash</Label>
          <Input value={verifyHash} onChange={(e) => setVerifyHash(e.target.value)} className="font-mono" />
        </div>
        <Button onClick={verify} disabled={!verifyPw || !verifyHash}>Verify</Button>
        {verifyResult === "match" && (
          <p className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">✓ Match — password is correct.</p>
        )}
        {verifyResult === "no-match" && (
          <p className="rounded-md bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-300">✗ No match.</p>
        )}
      </Card>
    </ToolShell>
  );
}
