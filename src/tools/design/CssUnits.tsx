import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const UNITS: { unit: string; type: string; relative: string; useFor: string }[] = [
  { unit: "px", type: "Absolute", relative: "Pixels — fixed.", useFor: "Borders, fine layout, things that should not scale." },
  { unit: "em", type: "Relative", relative: "Parent font-size.", useFor: "Component-local spacing that should scale with text." },
  { unit: "rem", type: "Relative", relative: "Root html font-size.", useFor: "Most spacing/typography — global rhythm." },
  { unit: "%", type: "Relative", relative: "Parent's size on the same axis.", useFor: "Fluid widths, fill-parent containers." },
  { unit: "vh", type: "Viewport", relative: "1% of viewport height.", useFor: "Full-screen hero sections, modals." },
  { unit: "vw", type: "Viewport", relative: "1% of viewport width.", useFor: "Fluid typography, full-bleed layouts." },
  { unit: "vmin", type: "Viewport", relative: "1% of the shorter viewport side.", useFor: "Square aspect on either orientation." },
  { unit: "vmax", type: "Viewport", relative: "1% of the longer viewport side.", useFor: "Less common — visually dominant elements." },
  { unit: "svh / lvh / dvh", type: "Viewport", relative: "Small / large / dynamic viewport height (mobile-safe).", useFor: "Mobile heroes — accounts for browser chrome." },
  { unit: "ch", type: "Typographic", relative: "Width of the '0' glyph in the current font.", useFor: "Measure-based line lengths (~60ch for prose)." },
  { unit: "ex", type: "Typographic", relative: "x-height of the current font.", useFor: "Rare; visual alignment with lowercase glyphs." },
  { unit: "lh / rlh", type: "Typographic", relative: "Current / root line-height.", useFor: "Spacing that aligns to your text grid." },
  { unit: "fr", type: "Grid", relative: "Fraction of the remaining grid track space.", useFor: "CSS Grid templates — `1fr 2fr` etc." },
  { unit: "deg / rad / turn", type: "Angle", relative: "Degrees, radians, full turns.", useFor: "transform: rotate(), gradient angles." },
  { unit: "s / ms", type: "Time", relative: "Seconds / milliseconds.", useFor: "transition-duration, animation-duration." },
];

export default function CssUnits() {
  return (
    <ToolShell title="CSS Units Reference" description="When to use px, em, rem, %, vh/vw, ch and friends." category={categoryMap.design}>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Unit</th>
              <th className="p-3">Type</th>
              <th className="p-3">Relative to</th>
              <th className="p-3">Use for</th>
            </tr>
          </thead>
          <tbody>
            {UNITS.map((u) => (
              <tr key={u.unit} className="border-b last:border-0">
                <td className="p-3 font-mono">{u.unit}</td>
                <td className="p-3 text-xs">{u.type}</td>
                <td className="p-3 text-muted-foreground">{u.relative}</td>
                <td className="p-3">{u.useFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Rule of thumb: <strong>rem</strong> for typography &amp; spacing, <strong>%</strong>/<strong>fr</strong> for fluid layout, <strong>dvh</strong> for mobile-safe full-height, <strong>px</strong> only for things that shouldn't scale (1px borders, icons inside text).
      </div>
    </ToolShell>
  );
}
