import { useEffect, useMemo, useState } from "react";
import type { AppProps } from "../system/types";
import {
  ChevronLeft,
  ChevronRight,
  FlameBrowserIcon,
  GitHubIcon,
  HomeIcon,
  KaveriShield,
  LockIcon,
  PlusIcon,
  PulseIcon,
  ReloadIcon,
  SearchIcon,
  ShieldAlert,
  ShieldCheck,
  XIcon,
  FileIcon,
} from "../components/icons";
import { BlockedPage, DocsPage, GitHubPage, HomePage, KaveriSite, SearchPage, type PageProps } from "./browserPages";

interface Tab {
  id: number;
  hist: string[];
  idx: number;
}

let tabSeq = 1;
const HOME_URL = "kaveri://home";

const ALLOWED_HOSTS = ["github.com", "kaveri.os", "docs.kaveri.os"];

function normalize(input: string): string {
  const t = input.trim();
  if (!t) return HOME_URL;
  if (t.startsWith("kaveri://")) return t;
  if (/^[\w-]+(\.[\w-]+)+(:\d+)?(\/.*)?$/.test(t)) return t.startsWith("http") ? t : `https://${t}`;
  return `kaveri://search?q=${encodeURIComponent(t)}`;
}

function hostOf(url: string): string {
  if (url.startsWith("kaveri://")) return "kaveri://";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function isAllowed(url: string): boolean {
  const h = hostOf(url);
  return ALLOWED_HOSTS.some((d) => h === d || h.endsWith("." + d));
}

function routeOf(url: string): { node: (p: PageProps) => React.ReactNode; title: string; favicon: React.ReactNode; secure: "local" | "secure" | "blocked" } {
  const h = hostOf(url);
  if (url.startsWith("kaveri://search")) return { node: SearchPage, title: `${decodeURIComponent(/q=([^&]*)/.exec(url)?.[1] || "")} — Kaveri Search`, favicon: <SearchIcon size={11} />, secure: "local" };
  if (url.startsWith("kaveri://")) return { node: HomePage, title: "New Tab — Kaveri Browser", favicon: <FlameBrowserIcon size={11} />, secure: "local" };
  if (!isAllowed(url)) return { node: BlockedPage, title: "Blocked — Kaveri Firewall", favicon: <ShieldAlert size={11} />, secure: "blocked" };
  if (h === "github.com") return { node: GitHubPage, title: "vaibhavthakur/kaveri-os · GitHub", favicon: <GitHubIcon size={11} />, secure: "secure" };
  if (h === "docs.kaveri.os") return { node: DocsPage, title: "Kaveri Documentation", favicon: <FileIcon size={11} />, secure: "secure" };
  if (h === "kaveri.os") return { node: KaveriSite, title: "Kaveri OS — Secure Horizon", favicon: <KaveriShield size={11} />, secure: "secure" };
  return { node: BlockedPage, title: "Blocked — Kaveri Firewall", favicon: <ShieldAlert size={11} />, secure: "blocked" };
}

export default function Browser({ api, payload }: AppProps) {
  const [tabs, setTabs] = useState<Tab[]>([{ id: tabSeq++, hist: [HOME_URL], idx: 0 }]);
  const [active, setActive] = useState(0);
  const [addr, setAddr] = useState("");
  const [menu, setMenu] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const payloadSeen = useMemo(() => payload, [payload]);

  const tab = tabs[active];
  const url = tab.hist[tab.idx];
  const route = routeOf(url);

  useEffect(() => {
    if (payloadSeen) {
      // open payload URL in a fresh focused tab
      setTabs((ts) => {
        const nt: Tab = { id: tabSeq++, hist: [payloadSeen], idx: 0 };
        return [...ts, nt];
      });
      setActive(tabs.length); // focus the new (last) tab
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payloadSeen]);

  useEffect(() => {
    setAddr(url.startsWith("kaveri://home") ? "" : url);
  }, [url, active]);

  const navTo = (raw: string) => {
    const u = normalize(raw);
    setTabs((ts) =>
      ts.map((t, i) => {
        if (i !== active) return t;
        const hist = [...t.hist.slice(0, t.idx + 1), u];
        return { ...t, hist, idx: hist.length - 1 };
      })
    );
    if (u !== url && !isAllowed(u) && !u.startsWith("kaveri://")) {
      api.notify("Kaveri Firewall", `egress to ${hostOf(u)} blocked by rule #447`, "warn");
    }
  };

  const back = () => setTabs((ts) => ts.map((t, i) => (i === active && t.idx > 0 ? { ...t, idx: t.idx - 1 } : t)));
  const fwd = () => setTabs((ts) => ts.map((t, i) => (i === active && t.idx < t.hist.length - 1 ? { ...t, idx: t.idx + 1 } : t)));
  const newTab = () => {
    setTabs((ts) => [...ts, { id: tabSeq++, hist: [HOME_URL], idx: 0 }]);
    setActive(tabs.length);
  };
  const closeTab = (i: number) => {
    const nt = tabs.filter((_, j) => j !== i);
    const next = nt.length ? nt : [{ id: tabSeq++, hist: [HOME_URL], idx: 0 }];
    setTabs(next);
    setActive((a) => {
      if (i < a) return a - 1;
      if (i === a) return Math.min(a, next.length - 1);
      return a;
    });
  };

  const Page = route.node;

  return (
    <div className="flex h-full flex-col bg-ink">
      {/* tabs strip */}
      <div className="flex items-end gap-1 bg-abyss/80 px-2 pt-1.5">
        {tabs.map((t, i) => {
          const r = routeOf(t.hist[t.idx]);
          const act = i === active;
          return (
            <div
              key={t.id}
              onClick={() => setActive(i)}
              className={`group flex min-w-0 max-w-[210px] flex-1 cursor-pointer items-center gap-2 rounded-t-md border border-b-0 px-3 py-1.5 text-[11.5px] transition ${
                act ? "border-edge bg-ink text-snow" : "border-transparent bg-panel/50 text-fog hover:bg-panel"
              }`}
            >
              <span className={r.secure === "blocked" ? "shrink-0 text-redx" : r.secure === "local" ? "shrink-0 text-tealx" : "shrink-0 text-fog"}>
                {r.favicon}
              </span>
              <span className="min-w-0 flex-1 truncate">{r.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(i);
                }}
                className="shrink-0 rounded p-0.5 text-dim opacity-0 transition group-hover:opacity-100 hover:bg-edge hover:text-snow"
              >
                <XIcon size={11} />
              </button>
            </div>
          );
        })}
        <button onClick={newTab} className="mb-1 grid h-6 w-6 shrink-0 place-items-center rounded-md text-fog transition hover:bg-raised hover:text-snow" aria-label="New tab">
          <PlusIcon size={14} />
        </button>
      </div>

      {/* toolbar */}
      <div className="flex items-center gap-2 border-b border-edge bg-ink px-2.5 py-1.5">
        <button onClick={back} disabled={tab.idx === 0} className="grid h-7 w-7 place-items-center rounded-md text-fog transition hover:bg-raised hover:text-snow disabled:opacity-30">
          <ChevronLeft size={15} />
        </button>
        <button onClick={fwd} disabled={tab.idx === tab.hist.length - 1} className="grid h-7 w-7 place-items-center rounded-md text-fog transition hover:bg-raised hover:text-snow disabled:opacity-30">
          <ChevronRight size={15} />
        </button>
        <button onClick={() => setReloadKey((k) => k + 1)} className="grid h-7 w-7 place-items-center rounded-md text-fog transition hover:bg-raised hover:text-snow">
          <ReloadIcon size={13.5} />
        </button>
        <button onClick={() => navTo(HOME_URL)} className="grid h-7 w-7 place-items-center rounded-md text-fog transition hover:bg-raised hover:text-snow">
          <HomeIcon size={14} />
        </button>

        <form
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full border border-edge2 bg-panel px-3.5 py-1.5 transition focus-within:border-tealx/60 focus-within:shadow-[0_0_0_3px_rgba(45,212,191,0.1)]"
          onSubmit={(e) => {
            e.preventDefault();
            navTo(addr);
          }}
        >
          {route.secure === "blocked" ? (
            <ShieldAlert size={13} className="shrink-0 text-redx" />
          ) : route.secure === "local" ? (
            <FlameBrowserIcon size={13} />
          ) : (
            <LockIcon size={13} className="shrink-0 text-tealx" />
          )}
          <input
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder="Search or enter address — filtered by Kaveri Firewall"
            className="w-full bg-transparent font-mono text-[12px] text-snow placeholder-dim outline-none"
            spellCheck={false}
          />
          {route.secure === "secure" && <span className="shrink-0 font-mono text-[9px] tracking-[0.18em] text-tealx uppercase">allowlisted</span>}
        </form>

        <div className="relative">
          <button onClick={() => setMenu(!menu)} className="grid h-7 w-7 place-items-center rounded-md text-fog transition hover:bg-raised hover:text-snow">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="12" cy="19" r="1.7" /></svg>
          </button>
          {menu && (
            <div className="animate-popin absolute top-9 right-0 z-50 w-56 overflow-hidden rounded-md border border-edge2 bg-panel shadow-[0_18px_50px_rgba(0,0,0,0.6)]" onMouseLeave={() => setMenu(false)}>
              {[
                { l: "New tab", fn: newTab },
                { l: "Open kaveri-os repo", fn: () => navTo("https://github.com/vaibhavthakur/kaveri-os") },
                { l: "Kaveri official site", fn: () => navTo("https://kaveri.os") },
                { l: "Documentation", fn: () => navTo("https://docs.kaveri.os") },
              ].map((it) => (
                <button key={it.l} onClick={() => { it.fn(); setMenu(false); }} className="block w-full px-4 py-2.5 text-left text-[12.5px] text-snow/85 transition hover:bg-raised">
                  {it.l}
                </button>
              ))}
              <div className="border-t border-edge bg-ink/60 px-4 py-2 font-mono text-[9.5px] tracking-wider text-dim">KAVERI BROWSER 2.1 · SANDBOXED</div>
            </div>
          )}
        </div>
      </div>

      {/* bookmarks bar */}
      <div className="flex items-center gap-1.5 border-b border-edge bg-ink/80 px-3 py-1">
        {[
          { l: "github · kaveri-os", u: "https://github.com/vaibhavthakur/kaveri-os", icon: <GitHubIcon size={11} /> },
          { l: "kaveri.os", u: "https://kaveri.os", icon: <KaveriShield size={11} /> },
          { l: "docs", u: "https://docs.kaveri.os", icon: <FileIcon size={11} /> },
          { l: "security console", u: "__monitor__", icon: <PulseIcon size={11} /> },
        ].map((b) => (
          <button
            key={b.l}
            onClick={() => (b.u === "__monitor__" ? api.openApp("monitor") : navTo(b.u))}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-[11px] text-fog transition hover:bg-raised hover:text-snow"
          >
            <span className="text-tealx">{b.icon}</span>
            {b.l}
          </button>
        ))}
        <span className="ml-auto flex items-center gap-1.5 pr-1 font-mono text-[9.5px] tracking-wider text-dim">
          <ShieldCheck size={11} className="text-tealx" /> EGRESS FILTER: ON
        </span>
      </div>

      {/* page */}
      <div key={reloadKey} className="min-h-0 flex-1">
        <Page url={url} nav={navTo} api={api} />
      </div>
    </div>
  );
}
