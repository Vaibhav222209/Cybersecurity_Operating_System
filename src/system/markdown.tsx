import { Fragment, type ReactNode } from "react";

// Minimal, aesthetic markdown renderer used by Files + the GitHub page.
// Supports: #/##/### headings, ---, ``` code fences, - and 1. lists,
// > callouts, | tables |, **bold**, `code`, [text](url), @@badges rows.

const BADGE_COLORS: Record<string, string> = {
  teal: "bg-tealx/15 text-mint border-tealx/40",
  amber: "bg-amberx/15 text-amberx border-amberx/40",
  blue: "bg-bluex/15 text-bluex border-bluex/40",
  red: "bg-redx/15 text-redx border-redx/40",
  fog: "bg-fog/10 text-fog border-edge2",
};

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) out.push(<Fragment key={`${keyBase}-t${i++}`}>{text.slice(last, m.index)}</Fragment>);
    const tok = m[0];
    if (tok.startsWith("**")) {
      out.push(
        <strong key={`${keyBase}-b${i++}`} className="font-semibold text-snow">
          {tok.slice(2, -2)}
        </strong>
      );
    } else if (tok.startsWith("`")) {
      out.push(
        <code
          key={`${keyBase}-c${i++}`}
          className="rounded border border-edge bg-ink px-1.5 py-0.5 font-mono text-[0.85em] text-mint"
        >
          {tok.slice(1, -1)}
        </code>
      );
    } else {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!;
      out.push(
        <span key={`${keyBase}-l${i++}`} className="cursor-pointer font-medium text-tealx underline decoration-tealx/40 underline-offset-2 hover:decoration-tealx">
          {mm[1]}
        </span>
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(<Fragment key={`${keyBase}-end`}>{text.slice(last)}</Fragment>);
  return out;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("@@badges")) {
      const items = line
        .slice(8)
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean)
        .map((b) => {
          const [label, value, color] = b.split("=");
          return { label: label?.trim(), value: value?.trim(), color: (color || "fog").trim() };
        });
      blocks.push(
        <div key={k++} className="my-4 flex flex-wrap gap-2">
          {items.map((b, j) => (
            <span
              key={j}
              className={`inline-flex items-center overflow-hidden rounded border font-mono text-[11px] leading-none ${BADGE_COLORS[b.color] || BADGE_COLORS.fog}`}
            >
              <span className="bg-black/30 px-2 py-1 font-semibold tracking-wide">{b.label}</span>
              <span className="px-2 py-1">{b.value}</span>
            </span>
          ))}
        </div>
      );
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        <div key={k++} className="my-4 overflow-hidden rounded-md border border-edge bg-abyss/80">
          <div className="flex items-center justify-between border-b border-edge bg-panel px-3 py-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">{lang || "text"}</span>
            <span className="flex gap-1">
              <i className="h-1.5 w-1.5 rounded-full bg-edge2" />
              <i className="h-1.5 w-1.5 rounded-full bg-edge2" />
            </span>
          </div>
          <pre className="overflow-x-auto p-3.5 font-mono text-[12.5px] leading-relaxed text-mint/90">{buf.join("\n")}</pre>
        </div>
      );
      continue;
    }

    if (/^#{1,3} /.test(line)) {
      const level = line.match(/^#+/)![0].length;
      const text = line.replace(/^#+ /, "");
      if (level === 1) {
        blocks.push(
          <h1 key={k++} className="mb-1 mt-2 border-b border-edge pb-3 font-display text-[26px] font-bold tracking-wide text-snow">
            {inline(text, `h${k}`)}
          </h1>
        );
      } else if (level === 2) {
        blocks.push(
          <h2 key={k++} className="mb-3 mt-8 flex items-center gap-2.5 font-display text-[18px] font-semibold tracking-wide text-tealx">
            <span className="h-4 w-1 rounded-full bg-tealx shadow-[0_0_10px_rgba(45,212,191,0.7)]" />
            {inline(text, `h${k}`)}
          </h2>
        );
      } else {
        blocks.push(
          <h3 key={k++} className="mb-2 mt-5 font-display text-[15px] font-semibold text-snow">
            {inline(text, `h${k}`)}
          </h3>
        );
      }
      i++;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push(<hr key={k++} className="my-6 border-edge" />);
      i++;
      continue;
    }

    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        buf.push(lines[i].replace(/^> ?/, ""));
        i++;
      }
      blocks.push(
        <div key={k++} className="my-4 rounded-r-md border-l-2 border-amberx/70 bg-amberx/[0.06] px-4 py-3 text-[13.5px] leading-relaxed text-snow/85">
          {buf.map((b, j) => (
            <p key={j}>{inline(b, `q${k}-${j}`)}</p>
          ))}
        </div>
      );
      continue;
    }

    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        const cells = lines[i]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        if (!cells.every((c) => /^-+$/.test(c))) rows.push(cells);
        i++;
      }
      blocks.push(
        <div key={k++} className="my-4 overflow-hidden rounded-md border border-edge">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-raised">
                {rows[0]?.map((c, j) => (
                  <th key={j} className="px-3.5 py-2 font-display text-[12px] font-semibold tracking-wide text-tealx">
                    {inline(c, `th${k}-${j}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((r, ri) => (
                <tr key={ri} className="border-t border-edge/70 odd:bg-panel/50 even:bg-ink/50">
                  {r.map((c, ci) => (
                    <td key={ci} className="px-3.5 py-2 text-snow/85">
                      {inline(c, `td${k}-${ri}-${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (/^\s*[-*] /.test(line) || /^\s*\d+\. /.test(line)) {
      const ordered = /^\s*\d+\. /.test(line);
      const items: string[] = [];
      while (i < lines.length && (/^\s*[-*] /.test(lines[i]) || /^\s*\d+\. /.test(lines[i]))) {
        items.push(lines[i].replace(/^\s*([-*]|\d+\.) /, ""));
        i++;
      }
      blocks.push(
        <ul key={k++} className="my-3 space-y-1.5 pl-1 text-[13.5px] leading-relaxed text-snow/85">
          {items.map((it, j) => (
            <li key={j} className="flex gap-2.5">
              <span className={`mt-[1px] shrink-0 font-mono ${ordered ? "text-amberx" : "text-tealx"}`}>
                {ordered ? `${j + 1}.` : "▸"}
              </span>
              <span>{inline(it, `li${k}-${j}`)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    blocks.push(
      <p key={k++} className="my-2.5 text-[13.5px] leading-relaxed text-snow/85">
        {inline(line, `p${k}`)}
      </p>
    );
    i++;
  }

  return <div className="markdown-root">{blocks}</div>;
}
