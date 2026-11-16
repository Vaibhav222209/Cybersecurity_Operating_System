import { useMemo, useState } from "react";
import { getNode, HOME, README_MD } from "../system/fs";
import { Markdown } from "../system/markdown";
import { WALLPAPER } from "../system/assets";
import type { OsApi } from "../system/types";
import {
  BranchIcon,
  CommitIcon,
  EyeIcon,
  FileIcon,
  FolderIcon,
  ForkIcon,
  GitHubIcon,
  IssueIcon,
  KaveriShield,
  LockIcon,
  PrIcon,
  PulseIcon,
  SearchIcon,
  ShieldAlert,
  ShieldCheck,
  StarIcon,
  ArrowUpRight,
  FlameBrowserIcon,
} from "../components/icons";

export interface PageProps {
  url: string;
  nav: (u: string) => void;
  api: OsApi;
}

/* ────────────────────────── HOME ────────────────────────── */

export function HomePage({ url, nav, api }: PageProps) {
  const [q, setQ] = useState("");
  const shortcuts = [
    { label: "kaveri-os · repo", sub: "github.com/vaibhavthakur", color: "#e8f0f6", go: "https://github.com/vaibhavthakur/kaveri-os", icon: <GitHubIcon size={20} /> },
    { label: "kaveri.os", sub: "official site", color: "#2dd4bf", go: "https://kaveri.os", icon: <KaveriShield size={20} /> },
    { label: "Field Guide", sub: "docs.kaveri.os", color: "#fbbf24", go: "https://docs.kaveri.os", icon: <FileIcon size={20} /> },
    { label: "Security Console", sub: "system monitor", color: "#7dd3fc", go: "__monitor__", icon: <PulseIcon size={20} /> },
  ];
  return (
    <div className="hexgrid flex h-full flex-col items-center overflow-y-auto bg-ink px-6 pt-[9vh] pb-8">
      <div className="animate-rise flex flex-col items-center">
        <FlameBrowserIcon size={64} />
        <h1 className="mt-4 font-display text-[26px] font-bold tracking-[0.08em] text-snow">
          Kaveri <span className="text-tealx">Browser</span>
        </h1>
        <p className="mt-1 font-mono text-[10.5px] tracking-[0.28em] text-dim uppercase">Private · Sandboxed · Firewall-filtered</p>

        <form
          className="mt-8 w-[min(560px,86vw)]"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) nav(`kaveri://search?q=${encodeURIComponent(q.trim())}`);
          }}
        >
          <div className="group flex items-center gap-3 rounded-full border border-edge2 bg-panel px-5 py-3 shadow-[0_10px_36px_rgba(0,0,0,0.45)] transition focus-within:border-tealx/60 focus-within:shadow-[0_0_0_3px_rgba(45,212,191,0.12),0_10px_36px_rgba(0,0,0,0.45)]">
            <SearchIcon size={17} className="shrink-0 text-dim transition group-focus-within:text-tealx" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the secure web or type an address"
              className="w-full bg-transparent text-[14px] text-snow placeholder-dim outline-none"
            />
            <LockIcon size={15} className="shrink-0 text-tealx" />
          </div>
        </form>

        <div className="mt-10 grid w-[min(560px,86vw)] grid-cols-2 gap-3 sm:grid-cols-4">
          {shortcuts.map((s) => (
            <button
              key={s.label}
              onClick={() => (s.go === "__monitor__" ? api.openApp("monitor") : nav(s.go))}
              className="group flex flex-col items-center gap-2 rounded-lg border border-edge bg-panel/70 px-3 py-4 transition hover:-translate-y-0.5 hover:border-edge2 hover:bg-raised"
            >
              <span className="grid h-11 w-11 place-items-center rounded-lg border border-edge bg-ink transition group-hover:scale-105" style={{ color: s.color }}>
                {s.icon}
              </span>
              <span className="text-[11.5px] font-semibold text-snow">{s.label}</span>
              <span className="font-mono text-[9px] tracking-wide text-dim">{s.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center gap-2 rounded-full border border-tealx/25 bg-tealx/[0.06] px-4 py-1.5">
        <ShieldCheck size={13} className="text-tealx" />
        <span className="font-mono text-[10px] tracking-wider text-fog">
          ALL TRAFFIC FILTERED BY KAVERI FIREWALL — {url.startsWith("kaveri://") ? "LOCAL PAGE" : "ENCRYPTED"}
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────── GITHUB ────────────────────────── */

const COMMIT_MSGS: Record<string, string> = {
  ".github": "ci: sign releases with hardened key",
  src: "hardened firewall ruleset + audit hooks",
  "README.md": "docs: workflow & how-to-open sections",
  LICENSE: "initial commit",
  "CONTRIBUTING.md": "docs: contribution security policy",
  "SECURITY.md": "docs: coordinated disclosure policy",
  "install.sh": "installer: verify signature after build",
  "package.json": "chore: bump to 2.1.0 Secure Horizon",
};

const REPO_FILES = getNode([...HOME, "github", "kaveri-os"])?.children || [];

export function GitHubPage({ url, nav }: PageProps) {
  const [openFile, setOpenFile] = useState<string | null>(null);
  const pathSegs = useMemo(() => {
    const m = /github\.com\/vaibhavthakur\/kaveri-os(\/(tree|blob)\/main(\/.*))?$/.exec(url);
    return m?.[4] ? m[4].split("/").filter(Boolean) : [];
  }, [url]);

  const node = openFile ? getNode([...HOME, "github", "kaveri-os", openFile]) : null;
  const fileLines = node?.content?.split("\n") ?? [];

  return (
    <div className="h-full overflow-y-auto bg-[#0b1016] text-snow">
      {/* github top strip */}
      <div className="sticky top-0 z-10 border-b border-edge bg-[#0d1319]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1060px] items-center gap-4 px-5 py-3">
          <GitHubIcon size={26} className="shrink-0 text-snow" />
          <div className="flex min-w-0 items-center gap-1.5 text-[13.5px]">
            <span className="cursor-pointer text-bluex hover:underline" onClick={() => nav("kaveri://home")}>vaibhavthakur</span>
            <span className="text-dim">/</span>
            <span className="cursor-pointer font-semibold text-bluex hover:underline">kaveri-os</span>
            <span className="ml-2 rounded-full border border-edge2 px-2 py-0.5 font-mono text-[9.5px] tracking-wider text-fog">Public</span>
          </div>
          <div className="ml-auto hidden items-center gap-2 sm:flex">
            {[
              { icon: <EyeIcon size={13} />, label: "Watch", n: "96" },
              { icon: <ForkIcon size={13} />, label: "Fork", n: "312" },
              { icon: <StarIcon size={13} />, label: "Star", n: "2.1k", star: true },
            ].map((b) => (
              <button key={b.label} className={`flex items-center overflow-hidden rounded-md border border-edge2 bg-raised text-[11.5px] transition hover:bg-lifted ${b.star ? "text-amberx" : "text-snow"}`}>
                <span className="flex items-center gap-1.5 px-2.5 py-1.5">{b.icon}{b.label}</span>
                <span className="border-l border-edge2 bg-ink px-2 py-1.5 font-mono text-[10.5px] text-fog">{b.n}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mx-auto flex max-w-[1060px] items-center gap-5 px-5 text-[12.5px]">
          {[
            { icon: <GitHubIcon size={13} />, label: <>Code</>, active: true },
            { icon: <IssueIcon size={13} />, label: <>Issues <b className="font-mono text-[10.5px] text-fog">7</b></> },
            { icon: <PrIcon size={13} />, label: <>Pull requests <b className="font-mono text-[10.5px] text-fog">3</b></> },
            { icon: <PulseIcon size={13} />, label: <>Actions</> },
            { icon: <ShieldCheck size={13} />, label: <>Security</> },
          ].map((t, i) => (
            <span key={i} className={`flex cursor-pointer items-center gap-1.5 border-b-2 py-2.5 transition ${t.active ? "border-amberx font-semibold text-snow" : "border-transparent text-fog hover:text-snow"}`}>
              {t.icon}
              {t.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1060px] grid-cols-1 gap-8 px-5 py-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          {/* latest commit bar */}
          <div className="mb-4 flex flex-wrap items-center gap-2.5 rounded-md border border-edge bg-panel px-4 py-2.5 text-[12px]">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-tealx/15 font-display text-[10px] font-bold text-tealx">VT</span>
            <span className="font-semibold text-snow">vaibhavthakur</span>
            <span className="truncate text-fog">{openFile ? COMMIT_MSGS[openFile] ?? "update" : "hardened firewall ruleset + audit hooks"}</span>
            <span className="ml-auto flex items-center gap-3 font-mono text-[10.5px] text-dim">
              <span className="flex items-center gap-1.5 text-bluex"><CommitIcon size={12} /> a3f9c21</span>
              <span>2 days ago</span>
              <span className="hidden items-center gap-1.5 sm:flex"><CommitIcon size={12} /> 247 commits</span>
            </span>
          </div>

          {node && node.type === "file" ? (
            /* ── file blob view ── */
            <div className="overflow-hidden rounded-md border border-edge">
              <div className="flex flex-wrap items-center gap-2 border-b border-edge bg-raised px-4 py-2.5 text-[12.5px]">
                <button onClick={() => setOpenFile(null)} className="text-bluex hover:underline">kaveri-os</button>
                <span className="text-dim">/</span>
                <span className="font-semibold text-snow">{openFile}</span>
                <span className="ml-auto font-mono text-[10.5px] text-dim">{fileLines.length} lines · {node.size}</span>
              </div>
              {node.kind === "md" ? (
                <div className="bg-panel px-7 py-6"><Markdown source={node.content || ""} /></div>
              ) : (
                <pre className="overflow-x-auto bg-panel p-4 font-mono text-[12px] leading-relaxed text-[#c9e8dc]">{node.content}</pre>
              )}
            </div>
          ) : (
            <>
              {/* file table */}
              <div className="overflow-hidden rounded-md border border-edge">
                <div className="flex items-center gap-3 border-b border-edge bg-raised px-4 py-2">
                  <span className="flex items-center gap-1.5 rounded-md border border-edge2 bg-ink px-2.5 py-1 text-[12px] text-snow">
                    <BranchIcon size={13} className="text-tealx" /> main
                  </span>
                  <span className="font-mono text-[10.5px] text-dim">1 branch · 4 tags · 4.9 MB</span>
                  <button className="ml-auto rounded-md bg-tealx/90 px-3 py-1.5 text-[11.5px] font-bold text-abyss transition hover:bg-mint">
                    Code ▾
                  </button>
                </div>
                {REPO_FILES.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => f.type === "file" && setOpenFile(f.name)}
                    className={`grid w-full grid-cols-[20px_180px_1fr_90px] items-center gap-3 border-b border-edge/60 px-4 py-2.5 text-left text-[12.5px] transition last:border-0 ${
                      f.type === "file" ? "hover:bg-raised/70" : "cursor-default"
                    }`}
                  >
                    <span className={f.type === "dir" ? "text-amberx" : "text-fog"}>
                      {f.type === "dir" ? <FolderIcon size={15} /> : <FileIcon size={15} />}
                    </span>
                    <span className={`truncate ${f.type === "file" ? "text-bluex hover:underline" : "text-snow font-medium"}`}>{f.name}</span>
                    <span className="truncate text-fog">{COMMIT_MSGS[f.name] ?? "update"}</span>
                    <span className="text-right font-mono text-[10.5px] text-dim">{f.modified}</span>
                  </button>
                ))}
              </div>

              {/* README */}
              <div className="mt-5 overflow-hidden rounded-md border border-edge">
                <div className="flex items-center gap-2 border-b border-edge bg-raised px-4 py-2.5">
                  <FileIcon size={14} className="text-fog" />
                  <span className="text-[12.5px] font-semibold text-snow">README.md</span>
                  <span className="ml-auto font-mono text-[10px] tracking-wider text-dim">MIT · v2.1</span>
                </div>
                <div className="bg-panel px-7 py-6">
                  <Markdown source={README_MD} />
                </div>
              </div>
            </>
          )}
          {pathSegs.length > 0 && !openFile && null}
        </div>

        {/* ── sidebar ── */}
        <aside className="space-y-5">
          <div className="rounded-md border border-edge bg-panel p-4">
            <h3 className="font-display text-[12px] font-bold tracking-[0.16em] text-snow uppercase">About</h3>
            <p className="mt-2 text-[12.5px] leading-relaxed text-fog">
              A hardened, Linux-style secure operating system experience for the browser — boot sequence, login gate, window shell, terminal, firewall browser.
            </p>
            <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-bluex">
              <ArrowUpRight size={12} /> kaveri.os
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["cybersecurity", "linux", "os-simulation", "terminal", "react", "firewall"].map((t) => (
                <span key={t} className="rounded-full bg-tealx/12 px-2.5 py-1 text-[10.5px] font-medium text-mint transition hover:bg-tealx/25">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-edge pt-3 text-[12px] text-fog">
              <p className="flex items-center gap-2"><StarIcon size={13} className="text-amberx" /> <b className="text-snow">2,148</b> stars</p>
              <p className="flex items-center gap-2"><EyeIcon size={13} /> <b className="text-snow">96</b> watching</p>
              <p className="flex items-center gap-2"><ForkIcon size={13} /> <b className="text-snow">312</b> forks</p>
            </div>
          </div>

          <div className="rounded-md border border-edge bg-panel p-4">
            <h3 className="font-display text-[12px] font-bold tracking-[0.16em] text-snow uppercase">Releases</h3>
            <div className="mt-2.5">
              <p className="flex items-center gap-2 text-[12.5px] font-semibold text-bluex">
                Kaveri OS 2.1 “Secure Horizon”
                <span className="rounded-full bg-tealx/15 px-2 py-0.5 text-[9.5px] font-bold tracking-wider text-tealx uppercase">Latest</span>
              </p>
              <p className="mt-1 font-mono text-[10.5px] text-dim">Feb 1, 2026 · signed · sha256 verified</p>
            </div>
          </div>

          <div className="rounded-md border border-edge bg-panel p-4">
            <h3 className="font-display text-[12px] font-bold tracking-[0.16em] text-snow uppercase">Languages</h3>
            <div className="mt-3 flex h-2 overflow-hidden rounded-full">
              <span className="bg-bluex" style={{ width: "58%" }} />
              <span className="bg-tealx" style={{ width: "22%" }} />
              <span className="bg-amberx" style={{ width: "12%" }} />
              <span className="bg-edge2" style={{ width: "8%" }} />
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[11px] text-fog">
              <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-bluex" />TypeScript 58%</span>
              <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-tealx" />TSX 22%</span>
              <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amberx" />Shell 12%</span>
              <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-edge2" />Other 8%</span>
            </div>
          </div>

          <div className="rounded-md border border-tealx/25 bg-tealx/[0.05] p-4">
            <p className="flex items-center gap-2 text-[12px] font-semibold text-mint"><ShieldCheck size={14} /> Security policy active</p>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-fog">Coordinated disclosure via SECURITY.md — reports to vaibhav@kaveri.os</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ────────────────────────── SEARCH ────────────────────────── */

export function SearchPage({ url, nav }: PageProps) {
  const q = decodeURIComponent(/q=([^&]*)/.exec(url)?.[1] || "");
  const slug = q.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const results = [
    {
      title: `vaibhavthakur/kaveri-os — ${q || "secure OS"}`,
      site: "github.com › vaibhavthakur › kaveri-os",
      go: "https://github.com/vaibhavthakur/kaveri-os",
      snip: `A hardened Linux-style secure operating system for the browser. Includes boot sequence, login gate (kaveri/kaveri), terminal, firewall browser and this repo's file explorer.`,
      star: true,
    },
    {
      title: `${q} — Kaveri Knowledge Base`,
      site: "docs.kaveri.os › guides › " + slug,
      go: "https://docs.kaveri.os",
      snip: `Field guide entry for “${q}”: how Kaveri OS opens, how the workflow runs from boot to shell, and which hardened commands relate to ${q.toLowerCase() || "this topic"}.`,
    },
    {
      title: `Understanding ${q} · Kaveri Security Blog`,
      site: "kaveri.os › blog › " + slug,
      go: "https://kaveri.os",
      snip: `Deep dive by Vaibhav Thakur: attack surface analysis, firewall rules and sandboxing strategy around ${q.toLowerCase() || "the topic"} — with a live simulated demo.`,
    },
    {
      title: `${q} cheat sheet (PDF) — mirror`,
      site: "mirror.example.net › files",
      go: "https://mirror.example.net/files/" + slug,
      snip: `Third-party mirror hosting a ${q} cheat sheet. Not on the Kaveri allowlist — expect the firewall to intercept this one.`,
    },
  ];
  return (
    <div className="h-full overflow-y-auto bg-ink">
      <div className="border-b border-edge bg-panel/60 px-8 py-5">
        <div className="flex items-center gap-4">
          <FlameBrowserIcon size={30} />
          <form
            className="flex w-[min(620px,70vw)] items-center gap-3 rounded-full border border-edge2 bg-ink px-4 py-2.5 focus-within:border-tealx/60"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              nav(`kaveri://search?q=${encodeURIComponent(String(fd.get("q") || ""))}`);
            }}
          >
            <input name="q" defaultValue={q} className="w-full bg-transparent text-[13.5px] text-snow outline-none" />
            <SearchIcon size={15} className="text-dim" />
          </form>
        </div>
        <p className="mt-3 font-mono text-[10.5px] tracking-wider text-dim">
          Kaveri Firewall scanned 4 sources in 0.12s · 1 result off-allowlist (flagged)
        </p>
      </div>
      <div className="mx-auto max-w-[680px] space-y-7 px-8 py-6">
        {results.map((r) => (
          <div key={r.title} className="group">
            <p className="font-mono text-[10.5px] text-dim">{r.site}</p>
            <button onClick={() => nav(r.go)} className="mt-0.5 text-left text-[16.5px] font-medium text-bluex hover:underline">
              {r.title}
              {r.star && <span className="ml-2 rounded-full bg-tealx/15 px-2 py-0.5 align-middle font-mono text-[9.5px] font-bold tracking-wider text-tealx uppercase">allowlisted</span>}
            </button>
            <p className="mt-1 text-[12.5px] leading-relaxed text-fog">{r.snip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────── BLOCKED / HONEYPOT ────────────────────────── */

export function BlockedPage({ url, nav }: PageProps) {
  const [tripped, setTripped] = useState(false);
  if (tripped) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-abyss px-8 text-center">
        <div className="animate-glitch font-mono text-[11px] tracking-[0.4em] text-redx uppercase">/// honeypot engaged ///</div>
        <h2 className="mt-4 font-display text-[30px] font-bold text-snow">Connection contained.</h2>
        <p className="mt-3 max-w-[440px] text-[13.5px] leading-relaxed text-fog">
          The destination <span className="font-mono text-amberx">{url}</span> was forced past the block page — so Kaveri Firewall
          routed it into a sandbox honeypot and issued a bait token. No data left this machine.
        </p>
        <div className="mt-6 rounded-md border border-redx/30 bg-redx/[0.06] px-5 py-3 font-mono text-[11px] text-redx/90">
          incident #4471 logged · source quarantined · audit daemon notified
        </div>
        <button onClick={() => nav("kaveri://home")} className="mt-8 rounded-md border border-tealx/50 bg-tealx/10 px-5 py-2.5 text-[13px] font-semibold text-mint transition hover:bg-tealx/20">
          Return to safety
        </button>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col items-center justify-center bg-ink px-8 text-center">
      <span className="pulse-ring grid h-20 w-20 place-items-center rounded-full border border-redx/40 bg-redx/10 text-redx">
        <ShieldAlert size={38} />
      </span>
      <p className="mt-6 font-mono text-[10.5px] tracking-[0.34em] text-redx uppercase">Blocked by Kaveri Firewall</p>
      <h2 className="mt-2 font-display text-[28px] font-bold text-snow">This destination is off the allowlist</h2>
      <p className="mt-3 max-w-[460px] text-[13.5px] leading-relaxed text-fog">
        Kaveri OS routes all browser traffic through an egress allowlist. <span className="font-mono text-[12px] text-amberx">{url}</span> is
        not an authorized destination in this secure environment (the network here is simulated).
      </p>
      <div className="mt-6 flex items-center gap-2 rounded-md border border-edge bg-panel px-4 py-2.5 font-mono text-[11px] text-fog">
        <LockIcon size={13} className="text-tealx" /> rule #447 · egress drop · logged by kaveri-auditd
      </div>
      <div className="mt-8 flex gap-3">
        <button onClick={() => nav("kaveri://home")} className="rounded-md bg-tealx px-5 py-2.5 text-[13px] font-bold text-abyss transition hover:bg-mint">
          Back to safety
        </button>
        <button onClick={() => setTripped(true)} className="rounded-md border border-redx/40 px-5 py-2.5 text-[13px] font-semibold text-redx transition hover:bg-redx/10">
          Proceed anyway (unsafe)
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────── KAVERI.OS SITE ────────────────────────── */

export function KaveriSite({ nav, api }: PageProps) {
  return (
    <div className="h-full overflow-y-auto bg-abyss">
      <div className="relative overflow-hidden border-b border-edge">
        <div className="hexgrid animate-gridpan absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-[900px] px-8 py-14 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-tealx/40 bg-tealx/10 text-tealx">
            <KaveriShield size={36} />
          </span>
          <h1 className="mt-5 font-display text-[40px] leading-tight font-bold text-snow">
            Kaveri <span className="text-tealx">OS</span>
          </h1>
          <p className="mx-auto mt-2 max-w-[520px] text-[14.5px] leading-relaxed text-fog">
            A hardened, Linux-style secure operating system that lives entirely in your browser.
            Boot it. Log in. Open the terminal. Nothing leaves the sandbox.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <button onClick={() => api.openApp("terminal")} className="rounded-md bg-tealx px-6 py-2.5 text-[13.5px] font-bold text-abyss transition hover:bg-mint">
              Launch Terminal
            </button>
            <button onClick={() => nav("https://github.com/vaibhavthakur/kaveri-os")} className="flex items-center gap-2 rounded-md border border-edge2 bg-panel px-6 py-2.5 text-[13.5px] font-semibold text-snow transition hover:bg-raised">
              <GitHubIcon size={15} /> View source
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[900px] px-8 py-10">
        <img src={WALLPAPER} alt="Kaveri OS desktop" className="w-full rounded-lg border border-edge2 shadow-[0_24px_70px_rgba(0,0,0,0.6)]" />
        <p className="mt-2 text-center font-mono text-[10px] tracking-[0.24em] text-dim uppercase">The Kaveri desktop shell — “Secure Horizon” wallpaper</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Verified boot", d: "Logged kernel modules, LUKS2 home encryption and a display-manager gate before anything renders." },
            { t: "Egress firewall", d: "Every URL passes an allowlist. Strangers get blocked — or lured into a honeypot sandbox." },
            { t: "Real shell", d: "26 commands over a virtual filesystem: ls, cat, tree, nmap, ping, neofetch, sudo (good luck)." },
          ].map((f) => (
            <div key={f.t} className="rounded-lg border border-edge bg-panel p-5 transition hover:-translate-y-0.5 hover:border-tealx/40">
              <h3 className="font-display text-[15px] font-bold text-tealx">{f.t}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-fog">{f.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 border-t border-edge pt-6 text-center font-mono text-[11px] tracking-wider text-dim">
          © 2026 · crafted by <span className="text-mint">Vaibhav Thakur</span> · MIT license
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────── DOCS ────────────────────────── */

export function DocsPage({ api }: PageProps) {
  const topics = [
    { t: "How to open Kaveri OS", d: "Boot sequence → login with kaveri / kaveri → desktop shell.", app: "guides" as const },
    { t: "The workflow", d: "Boot → login → shell → apps → session controls, end to end.", app: "guides" as const },
    { t: "Terminal quick reference", d: "Every hardened command with examples.", app: "terminal" as const },
    { t: "Firewall model", d: "Allowlist, drop rules, honeypot behaviour.", app: "monitor" as const },
  ];
  return (
    <div className="h-full overflow-y-auto bg-ink px-8 py-10">
      <div className="mx-auto max-w-[640px]">
        <p className="font-mono text-[10.5px] tracking-[0.3em] text-tealx uppercase">docs.kaveri.os</p>
        <h1 className="mt-2 font-display text-[28px] font-bold text-snow">Kaveri documentation</h1>
        <p className="mt-2 text-[13.5px] text-fog">Pick a topic — each one opens the right tool inside the OS.</p>
        <div className="mt-7 space-y-3">
          {topics.map((t) => (
            <button key={t.t} onClick={() => api.openApp(t.app)} className="group flex w-full items-center gap-4 rounded-lg border border-edge bg-panel px-5 py-4 text-left transition hover:border-tealx/40 hover:bg-raised">
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold text-snow group-hover:text-mint">{t.t}</span>
                <span className="mt-0.5 block text-[12px] text-fog">{t.d}</span>
              </span>
              <ArrowUpRight size={16} className="shrink-0 text-dim transition group-hover:text-tealx" />
            </button>
          ))}
        </div>
        <p className="mt-8 font-mono text-[10.5px] tracking-wider text-dim">maintained by Vaibhav Thakur · synced from github.com/vaibhavthakur/kaveri-os</p>
      </div>
    </div>
  );
}
