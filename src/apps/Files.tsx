import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppProps } from "../system/types";
import { getNode, HOME, prettyPath, type FsNode } from "../system/fs";
import { Markdown } from "../system/markdown";
import {
  BranchIcon,
  ChevronLeft,
  ChevronRight,
  FileIcon,
  FolderIcon,
  GitHubIcon,
  GridIcon,
  HomeIcon,
  LockIcon,
  MonitorIcon,
  SearchIcon,
  ShieldCheck,
  TrashIcon,
  XIcon,
  KaveriShield,
} from "../components/icons";

/* ── tiny syntax highlighter ── */
const KW = /\b(export|import|from|const|let|var|function|return|if|else|for|of|in|new|true|false|null|undefined|type|interface|async|await|default|extends|set|echo|local|name|on|run|uses|jobs|steps|needs|if)\b/;

function highlightLine(line: string, key: number): ReactNode {
  const re = /(\/\/.*$)|((?<![\w-])#.*$)|("[^"]*"|'[^']*'|`[^`]*`)|\b(\d+(?:\.\d+)?)\b/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  const kwSplit = (text: string, k: string) => {
    const parts = text.split(new RegExp(`(${KW.source})`, "g"));
    return parts.map((p, j) =>
      KW.test(p) && new RegExp(`^${KW.source}$`).test(p) ? (
        <span key={`${k}-${j}`} className="text-tealx">{p}</span>
      ) : (
        <span key={`${k}-${j}`}>{p}</span>
      )
    );
  };
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) out.push(<span key={`${key}-p${i++}`}>{kwSplit(line.slice(last, m.index), `${key}-k${i}`)}</span>);
    const cls = m[1] || m[2] ? "italic text-dim" : m[3] ? "text-amberx" : "text-bluex";
    out.push(<span key={`${key}-m${i++}`} className={cls}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(<span key={`${key}-e`}>{kwSplit(line.slice(last), `${key}-ke`)}</span>);
  return <>{out}</>;
}

function CodeView({ node }: { node: FsNode }) {
  const lines = (node.content || "").replace(/\n$/, "").split("\n");
  return (
    <div className="h-full overflow-auto bg-abyss/70 p-4 font-mono text-[12px] leading-[1.7] text-[#c9e8dc]">
      <table className="w-full border-separate border-spacing-0">
        <tbody>
          {lines.map((l, i) => (
            <tr key={i} className="hover:bg-tealx/[0.04]">
              <td className="w-10 pr-4 text-right align-top text-dim/70 select-none">{i + 1}</td>
              <td className="whitespace-pre">{highlightLine(l, i)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const KIND_LABEL: Record<string, [string, string]> = {
  md: ["MARKDOWN", "text-mint border-tealx/40 bg-tealx/10"],
  code: ["SOURCE", "text-bluex border-bluex/40 bg-bluex/10"],
  conf: ["CONFIG", "text-violetrx border-violetrx/40 bg-violetrx/10"],
  key: ["KEY MATERIAL", "text-amberx border-amberx/40 bg-amberx/10"],
  binary: ["BINARY", "text-redx border-redx/40 bg-redx/10"],
  text: ["PLAIN TEXT", "text-fog border-edge2 bg-fog/10"],
};

export default function Files({ api, payload }: AppProps) {
  const [cwd, setCwd] = useState<string[]>([...HOME]);
  const [back, setBack] = useState<string[][]>([]);
  const [fwd, setFwd] = useState<string[][]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [openFile, setOpenFile] = useState<{ node: FsNode; path: string[] } | null>(null);
  const [filter, setFilter] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [grid, setGrid] = useState(true);

  // deep links: desktop icons / terminal `open files github|readme`
  useEffect(() => {
    const repo = [...HOME, "github", "kaveri-os"];
    if (payload === "github") {
      setCwd(repo);
      setSelected(null);
      setOpenFile(null);
    } else if (payload === "readme") {
      const readme = getNode([...repo, "README.md"]);
      setCwd(repo);
      if (readme) setOpenFile({ node: readme, path: [...repo, "README.md"] });
    }
  }, [payload]);

  const node = getNode(cwd);
  const kids = useMemo(() => {
    const all = (node?.children || []).filter((c) => showHidden || !c.name.startsWith("."));
    const filtered = filter ? all.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase())) : all;
    return [...filtered].sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "dir" ? -1 : 1));
  }, [node, showHidden, filter]);

  const go = (parts: string[]) => {
    setBack((b) => [...b, cwd]);
    setFwd([]);
    setCwd(parts);
    setSelected(null);
  };
  const goBack = () => {
    setBack((b) => {
      if (!b.length) return b;
      setFwd((f) => [...f, cwd]);
      setCwd(b[b.length - 1]);
      return b.slice(0, -1);
    });
  };
  const goFwd = () => {
    setFwd((f) => {
      if (!f.length) return f;
      setBack((b) => [...b, cwd]);
      setCwd(f[f.length - 1]);
      return f.slice(0, -1);
    });
  };

  const open = (c: FsNode) => {
    if (c.type === "dir") go([...cwd, c.name]);
    else {
      setOpenFile({ node: c, path: [...cwd, c.name] });
      if (c.name === "README.md") api.notify("Files", "rendering README.md — workflow docs inside", "info");
    }
  };

  const fileIcon = (c: FsNode) => {
    if (c.type === "dir") {
      if (c.name === "kaveri-os") return <span className="text-snow"><GitHubIcon size={30} /></span>;
      if (c.name === ".ssh") return <span className="text-amberx"><LockIcon size={30} /></span>;
      return <span className="text-amberx"><FolderIcon size={30} /></span>;
    }
    if (c.kind === "md") return <span className="text-mint"><FileIcon size={30} /></span>;
    if (c.kind === "code") return <span className="text-bluex"><FileIcon size={30} /></span>;
    if (c.kind === "key") return <span className="text-amberx"><LockIcon size={30} /></span>;
    if (c.kind === "binary") return <span className="text-redx"><MonitorIcon size={30} /></span>;
    return <span className="text-fog"><FileIcon size={30} /></span>;
  };

  const PLACES: { label: string; icon: ReactNode; parts: string[] | null }[] = [
    { label: "Home", icon: <HomeIcon size={14} />, parts: [...HOME] },
    { label: "Desktop", icon: <MonitorIcon size={14} />, parts: [...HOME, "Desktop"] },
    { label: "Documents", icon: <FileIcon size={14} />, parts: [...HOME, "Documents"] },
    { label: "Downloads", icon: <ChevronRight size={14} />, parts: [...HOME, "Downloads"] },
    { label: "github / kaveri-os", icon: <GitHubIcon size={14} />, parts: [...HOME, "github", "kaveri-os"] },
    { label: "Vault (.ssh)", icon: <LockIcon size={14} />, parts: [...HOME, ".ssh"] },
    { label: "Filesystem /", icon: <BranchIcon size={14} />, parts: [] },
  ];

  return (
    <div className="relative flex h-full bg-ink">
      {/* sidebar */}
      <aside className="flex w-[190px] shrink-0 flex-col border-r border-edge bg-panel/70">
        <div className="border-b border-edge px-4 py-2.5">
          <p className="font-display text-[10px] font-bold tracking-[0.24em] text-dim uppercase">Places</p>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {PLACES.map((pl) => {
            const active = pl.parts && prettyPath(pl.parts) === prettyPath(cwd);
            return (
              <button
                key={pl.label}
                onClick={() => pl.parts && go(pl.parts)}
                className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[12px] transition ${
                  active ? "bg-tealx/10 font-semibold text-mint" : "text-fog hover:bg-raised hover:text-snow"
                }`}
              >
                <span className={active ? "text-tealx" : "text-dim"}>{pl.icon}</span>
                <span className="truncate">{pl.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="border-t border-edge p-2">
          <button
            onClick={() => api.notify("Trash", "Trash is empty — 0 threats in quarantine", "info")}
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[12px] text-fog transition hover:bg-raised hover:text-snow"
          >
            <TrashIcon size={14} className="text-dim" /> Trash
          </button>
          <div className="mt-1 rounded-md border border-tealx/25 bg-tealx/[0.05] px-2.5 py-2">
            <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-mint"><LockIcon size={11} /> LUKS2 volume</p>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-edge">
              <div className="h-full w-[31%] rounded-full bg-tealx shadow-[0_0_8px_var(--color-tealx)]" />
            </div>
            <p className="mt-1 font-mono text-[9px] tracking-wider text-dim">4.2 GB / 13.6 GB · AES-256</p>
          </div>
        </div>
      </aside>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* toolbar */}
        <div className="flex items-center gap-2 border-b border-edge bg-panel/50 px-3 py-2">
          <button onClick={goBack} disabled={!back.length} className="grid h-7 w-7 place-items-center rounded-md text-fog transition hover:bg-raised hover:text-snow disabled:opacity-30">
            <ChevronLeft size={14} />
          </button>
          <button onClick={goFwd} disabled={!fwd.length} className="grid h-7 w-7 place-items-center rounded-md text-fog transition hover:bg-raised hover:text-snow disabled:opacity-30">
            <ChevronRight size={14} />
          </button>

          {/* breadcrumb */}
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-md border border-edge bg-ink px-2.5 py-1.5 font-mono text-[11.5px] whitespace-nowrap">
            <button onClick={() => go([])} className="text-fog transition hover:text-tealx">/</button>
            {cwd.map((seg, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="text-dim">›</span>
                <button onClick={() => go(cwd.slice(0, i + 1))} className={`transition hover:text-tealx ${i === cwd.length - 1 ? "font-semibold text-mint" : "text-fog"}`}>
                  {seg}
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 rounded-md border border-edge bg-ink px-2.5 py-1.5">
            <SearchIcon size={12} className="text-dim" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="filter…"
              className="w-20 bg-transparent text-[11.5px] text-snow placeholder-dim outline-none"
            />
          </div>
          <button
            onClick={() => setShowHidden(!showHidden)}
            className={`rounded-md border px-2.5 py-1.5 font-mono text-[10px] tracking-wider transition ${
              showHidden ? "border-tealx/50 bg-tealx/10 text-mint" : "border-edge text-dim hover:text-fog"
            }`}
          >
            .*
          </button>
          <button onClick={() => setGrid(!grid)} className="grid h-7 w-7 place-items-center rounded-md border border-edge text-fog transition hover:bg-raised hover:text-snow">
            <GridIcon size={13} />
          </button>
        </div>

        {/* status strip */}
        <div className="flex items-center gap-3 border-b border-edge/60 bg-ink/60 px-4 py-1.5 font-mono text-[10px] tracking-wider text-dim">
          <span className="flex items-center gap-1.5"><KaveriShield size={11} className="text-tealx" /> {prettyPath(cwd)}</span>
          <span>{kids.length} items</span>
          <span className="ml-auto flex items-center gap-1.5"><ShieldCheck size={11} className="text-tealx" /> INTEGRITY VERIFIED</span>
        </div>

        {/* content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4" onClick={() => setSelected(null)}>
          {kids.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-dim">
              <FolderIcon size={44} />
              <p className="mt-3 font-mono text-[11px] tracking-[0.24em] uppercase">This directory is empty</p>
            </div>
          ) : grid ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2">
              {kids.map((c) => (
                <button
                  key={c.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(c.name);
                  }}
                  onDoubleClick={() => open(c)}
                  className={`group flex flex-col items-center gap-2 rounded-lg border px-2 py-4 transition ${
                    selected === c.name
                      ? "border-tealx/50 bg-tealx/[0.08] shadow-[0_0_0_3px_rgba(45,212,191,0.08)]"
                      : "border-transparent hover:border-edge hover:bg-raised/70"
                  }`}
                >
                  <span className="transition group-hover:scale-110">{fileIcon(c)}</span>
                  <span className="w-full truncate text-center text-[11px] text-snow/90">{c.name}</span>
                  <span className="font-mono text-[9px] text-dim">{c.type === "dir" ? "dir" : c.size}</span>
                </button>
              ))}
            </div>
          ) : (
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-edge font-display text-[10px] tracking-[0.18em] text-dim uppercase">
                  <th className="pb-2 font-semibold">Name</th>
                  <th className="pb-2 font-semibold">Size</th>
                  <th className="pb-2 font-semibold">Modified</th>
                  <th className="pb-2 font-semibold">Type</th>
                </tr>
              </thead>
              <tbody>
                {kids.map((c) => (
                  <tr
                    key={c.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(c.name);
                    }}
                    onDoubleClick={() => open(c)}
                    className={`cursor-default border-b border-edge/40 transition hover:bg-raised/60 ${selected === c.name ? "bg-tealx/[0.07]" : ""}`}
                  >
                    <td className="flex items-center gap-2.5 py-2 text-snow/90">
                      <span className="shrink-0 [&>span>svg]:h-4 [&>span>svg]:w-4">{fileIcon(c)}</span>
                      {c.name}
                    </td>
                    <td className="py-2 font-mono text-[10.5px] text-fog">{c.type === "dir" ? "—" : c.size}</td>
                    <td className="py-2 font-mono text-[10.5px] text-fog">{c.modified}</td>
                    <td className="py-2">
                      <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-wider ${KIND_LABEL[c.kind || ""]?.[1] || "text-fog border-edge"}`}>
                        {c.type === "dir" ? "DIR" : KIND_LABEL[c.kind || "text"]?.[0]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* file viewer overlay */}
      {openFile && (
        <div className="animate-popin absolute inset-0 z-20 flex flex-col border-l border-edge bg-panel">
          <div className="flex items-center gap-3 border-b border-edge bg-raised px-4 py-2.5">
            <span className="[&>span>svg]:h-4.5 [&>span>svg]:w-4.5">{fileIcon(openFile.node)}</span>
            <div className="min-w-0">
              <p className="truncate font-mono text-[12.5px] font-semibold text-snow">{openFile.node.name}</p>
              <p className="font-mono text-[9.5px] tracking-wider text-dim">
                {prettyPath(openFile.path)} · {openFile.node.size} · modified {openFile.node.modified}
              </p>
            </div>
            <span className={`ml-auto rounded border px-2 py-0.5 font-mono text-[9px] tracking-wider ${KIND_LABEL[openFile.node.kind || "text"]?.[1]}`}>
              {KIND_LABEL[openFile.node.kind || "text"]?.[0]}
            </span>
            <button onClick={() => setOpenFile(null)} className="grid h-7 w-7 place-items-center rounded-md text-fog transition hover:bg-lifted hover:text-snow">
              <XIcon size={14} />
            </button>
          </div>
          <div className="min-h-0 flex-1">
            {openFile.node.kind === "md" ? (
              <div className="h-full overflow-y-auto bg-ink px-8 py-6">
                <Markdown source={openFile.node.content || ""} />
              </div>
            ) : openFile.node.kind === "binary" ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 bg-abyss/70 px-8 text-center">
                <MonitorIcon size={42} className="text-redx" />
                <p className="font-display text-[16px] font-bold text-snow">Binary file — preview unavailable</p>
                <pre className="rounded-md border border-edge bg-ink px-5 py-3 font-mono text-[10.5px] leading-relaxed text-fog">
{`00000000  4b 41 56 45 52 49 2d 4f  53 20 32 2e 31 00 1f 8b  |KAVERI-OS 2.1...|
00000010  a3 f9 c2 17 44 21 90 55  6b 02 00 ff ee 51 7a 30  |....D!.Uk....Qz0|`}
                </pre>
                <p className="max-w-[380px] text-[12px] text-fog">
                  kaveri-os-2.1-secure.iso · bootable image · SHA-256 verified against dist/SHA256SUMS · signed by Vaibhav Thakur
                </p>
              </div>
            ) : (
              <CodeView node={openFile.node} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
