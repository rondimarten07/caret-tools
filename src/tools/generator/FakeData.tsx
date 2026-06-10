import { useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const TEMPLATES = [
  { id: "user", name: "Users" },
  { id: "address", name: "Addresses" },
  { id: "product", name: "Products" },
  { id: "company", name: "Companies" },
] as const;
type Template = (typeof TEMPLATES)[number]["id"];

function makeOne(t: Template) {
  switch (t) {
    case "user":
      return {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        username: faker.internet.userName(),
      };
    case "address":
      return {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
        country: faker.location.country(),
      };
    case "product":
      return {
        id: faker.string.nanoid(8),
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price()),
        category: faker.commerce.department(),
        sku: faker.string.alphanumeric(8).toUpperCase(),
      };
    case "company":
      return {
        name: faker.company.name(),
        slogan: faker.company.catchPhrase(),
        domain: faker.internet.domainName(),
        founded: faker.number.int({ min: 1900, max: 2024 }),
      };
  }
}

export default function FakeData() {
  const [template, setTemplate] = useState<Template>("user");
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState(0);

  const data = useMemo(() => {
    void seed;
    return Array.from({ length: Math.max(1, Math.min(200, count)) }, () => makeOne(template));
  }, [template, count, seed]);
  const json = JSON.stringify(data, null, 2);

  return (
    <ToolShell
      title="Fake Data Generator"
      description="Generate realistic fake data for prototyping."
      category={categoryMap.generator}
      actions={
        <>
          <CopyButton value={json} label="JSON copied" />
          <Button size="sm" onClick={() => setSeed((s) => s + 1)}>Regenerate</Button>
        </>
      }
    >
      <Card className="flex flex-wrap items-center gap-3 p-3">
        {TEMPLATES.map((t) => (
          <Button key={t.id} size="sm" variant={template === t.id ? "default" : "outline"} onClick={() => setTemplate(t.id)}>{t.name}</Button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Label className="text-xs">Count</Label>
          <Input type="number" min={1} max={200} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} className="w-24" />
        </div>
      </Card>
      <Card className="p-3">
        <Textarea readOnly value={json} className="min-h-[420px] bg-muted/30" />
      </Card>
    </ToolShell>
  );
}
