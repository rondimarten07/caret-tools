import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function ImageBase64() {
  const [dataUri, setDataUri] = useState("");
  const [info, setInfo] = useState<{ name: string; type: string; size: number } | null>(null);

  const onFile = async (f: File) => {
    setInfo({ name: f.name, type: f.type, size: f.size });
    const reader = new FileReader();
    reader.onload = () => setDataUri(reader.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <ToolShell title="Image → Base64" description="Convert an image to a Base64 data URI." category={categoryMap.image}>
      <Card className="space-y-3 p-3">
        <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        {info && (
          <div className="text-xs text-muted-foreground">
            {info.name} · {info.type} · {(info.size / 1024).toFixed(1)} KB
          </div>
        )}
      </Card>
      {dataUri && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="grid place-items-center p-3"><img src={dataUri} alt="" className="max-h-72 max-w-full rounded-md border" /></Card>
          <Card className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <Label>Data URI</Label>
              <CopyButton value={dataUri} />
            </div>
            <Textarea readOnly value={dataUri} className="min-h-[260px] bg-muted/30" />
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
