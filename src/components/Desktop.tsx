import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { AppDef, AppId, NotifyKind, OsApi, WindowData } from "../system/types";
import Window from "./Window";
import TopBar, { type Toggles } from "./TopBar";
import Dock from "./Dock";
import Terminal from "../apps/Terminal";
import Browser from "../apps/Browser";
import Files from "../apps/Files";
import Monitor from "../apps/Monitor";
import Guides from "../apps/Guides";
import About from "../apps/About";
import { WALLPAPER } from "../system/assets";
import {
  BrowserIcon,
  FileIcon,
  FolderIcon,
  GitHubIcon,
  GuideIcon,
  InfoIcon,
  MonitorIcon,
  ShieldCheck,
  ShieldAlert,
  TerminalIcon,
} from "./icons";

const APPS: AppDef[] = [
  { id: "terminal", name: "Terminal", tagline: "hardened shell · 26 commands", component: Terminal, w: 760, h: 450, accent: "#2dd4bf" },
  { id: "browser", name: "Kaveri Browser", tagline: "firefox-style · firewall-routed", component: Browser, w: 1000, h: 620, accent: "#fb923c" },
  { id: "files", name: "Files", tagline: "file manager · markdown viewer", component: Files, w: 920, h: 560, accent: "#fbbf24" },
  { id: "monitor", name: "System Monitor", tagline: "telemetry · live threat feed", component: Monitor, w: 860, h: 590, accent: "#7dd3fc" },
  { id: "guides", name: "Field Guide", tagline: "how to open · workflow", component: Guides, w: 900, h: 610, accent: "#b39ddb" },
  { id: "about", name: "About Kaveri OS", tagline: "system · credits", component: About, w: 620, h: 640, accent: "#7cf5d4" },
];

const APP_ICON: Record<AppId, ReactNode> = {
  terminal: <TerminalIcon size={13} />,
  browser: <BrowserIcon size={13} />,
  files: <FolderIcon size={13} />,
  monitor: <MonitorIcon size={13} />,
  guides: <GuideIcon size={13} />,
  about: <InfoIcon size={13} />,
};

interface Toast {
  id: number;
  title: string;
  body?: string;
  kind: NotifyKind;
}

interface Props {
  onLock: () => void;
  onLogout: () => void;
  onRestart: () => void;
  onPowerOff: () => void;
}

let winSeq = 1;
let toastSeq = 1;

export default function Desktop({ onLock, onLogout, onRestart, onPowerOff }: Props) {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [payloads, setPayloads] = useState<Partial<Record<AppId, string>>>({});
  const [toggles, setToggles] = useState<Toggles>({ firewall: true, wifi: true, nightlight: false, scanlines: true });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ctx, setCtx] = useState<{ x: number; y: number } | null>(null);
  const [selIcon, setSelIcon] = useState<string | null>(null);
  const zTop = useRef(10);
  const welcomed = useRef(false);

  const notify = useCallback((title: string, body?: string, kind: NotifyKind = "info") => {
    const id = toastSeq++;
    setToasts((ts) => [...ts.slice(-3), { id, title, body, kind }]);
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 5600);
  }, []);

  const openApp = useCallback(
    (id: AppId, payload?: string) => {
      if (payload !== undefined) setPayloads((p) => ({ ...p, [id]: payload }));
      setWindows((ws) => {
        const existing = ws.find((w) => w.app === id);
        if (existing) {
          return ws.map((w) => (w.app === id ? { ...w, minimized: false, z: ++zTop.current } : w));
        }
        const def = APPS.find((a) => a.id === id)!;
        const n = ws.length;
        const w = Math.min(def.w, window.innerWidth - 110);
        const h = Math.min(def.h, window.innerHeight - 70);
        const x = Math.max(86, 110 + ((n * 46) % Math.max(60, window.innerWidth - w - 160)));
        const y = Math.max(44, 62 + ((n * 34) % Math.max(40, window.innerHeight - h - 110)));
        return [...ws, { id: winSeq++, app: id, title: def.name, x, y, w, h, z: ++zTop.current, minimized: false, maximized: false }];
      });
    },
    []
  );

  const closeApp = useCallback((id: AppId) => {
    setWindows((ws) => ws.filter((w) => w.app !== id));
  }, []);

  const api: OsApi = { openApp, closeApp, notify, logout: onLogout };

  // welcome sequence
  useEffect(() => {
    if (welcomed.current) return;
    welcomed.current = true;
    const t1 = setTimeout(() => {
      openApp("guides");
      notify("Welcome back, kaveri", "home decrypted · firewall active · 0 threats", "success");
    }, 650);
    const t2 = setTimeout(() => notify("Kaveri Firewall", "blocked tracker ads.malware.net (rule #447)", "warn"), 14000);
    const t3 = setTimeout(() => notify("Audit daemon", "login gate checksums re-verified", "info"), 30000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [openApp, notify]);

  const focused = [...windows].filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0] ?? null;

  const focus = (id: number) => setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z: ++zTop.current } : w)));
  const patch = (id: number, p: Partial<WindowData>) => setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, ...p } : w)));
  const toggleMax = (w: WindowData) => patch(w.id, { maximized: !w.maximized });

  const onToggleSetting = (k: keyof Toggles) => {
    setToggles((t) => {
      const next = { ...t, [k]: !t[k] };
      if (k === "firewall")
        notify("Kaveri Firewall", next.firewall ? "firewall re-enabled · 1,204 rules active" : "WARNING: firewall disabled — traffic unfiltered", next.firewall ? "success" : "danger");
      if (k === "wifi") notify("NetworkManager", next.wifi ? "wlan0 reconnected · kaveri-secure-5G" : "wlan0 down — browser will fail closed", next.wifi ? "success" : "warn");
      return next;
    });
  };

  const DESKTOP_ICONS: { key: string; label: string; icon: ReactNode; color: string; fn: () => void }[] = [
    { key: "repo", label: "kaveri-os", icon: <GitHubIcon size={30} />, color: "#e8f0f6", fn: () => openApp("files", "github") },
    { key: "readme", label: "README.md", icon: <FileIcon size={30} />, color: "#7cf5d4", fn: () => openApp("files", "readme") },
    { key: "guide", label: "Field Guide", icon: <GuideIcon size={30} />, color: "#b39ddb", fn: () => openApp("guides") },
    { key: "term", label: "Terminal", icon: <TerminalIcon size={30} />, color: "#2dd4bf", fn: () => openApp("terminal") },
  ];

  return (
    <div
      className="relative h-full overflow-hidden bg-abyss select-none"
      onMouseDown={() => {
        setCtx(null);
        setSelIcon(null);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setCtx({ x: Math.min(e.clientX, window.innerWidth - 220), y: Math.min(e.clientY, window.innerHeight - 240) });
      }}
    >
      {/* wallpaper layers */}
      <img src={WALLPAPER} alt="" className="absolute inset-0 h-full w-full object-cover no-drag" draggable={false} />
      <div className="absolute inset-0 bg-gradient-to-br from-abyss/45 via-transparent to-abyss/55" />
      <div className="vignette absolute inset-0" />

      {/* desktop icons */}
      <div className="absolute top-12 right-3 z-10 flex flex-col gap-1.5">
        {DESKTOP_ICONS.map((ic) => (
          <button
            key={ic.key}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setSelIcon(ic.key)}
            onDoubleClick={ic.fn}
            className={`flex w-[86px] flex-col items-center gap-1.5 rounded-lg border px-2 py-3 transition ${
              selIcon === ic.key ? "border-tealx/50 bg-tealx/[0.12] shadow-[0_0_0_3px_rgba(45,212,191,0.1)]" : "border-transparent hover:bg-snow/[0.06]"
            }`}
          >
            <span style={{ color: ic.color, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))" }}>{ic.icon}</span>
            <span className="text-[10.5px] font-medium text-snow [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">{ic.label}</span>
          </button>
        ))}
      </div>

      {/* watermark */}
      <div className="pointer-events-none absolute right-6 bottom-5 z-10 text-right">
        <p className="font-display text-[13px] font-bold tracking-[0.3em] text-snow/25">KAVERI·OS 2.1</p>
        <p className="font-mono text-[9px] tracking-[0.24em] text-snow/20 uppercase">secure horizon · by Vaibhav Thakur</p>
      </div>

      <TopBar
        apps={APPS}
        windows={windows}
        focusedApp={focused?.app ?? null}
        toggles={toggles}
        onToggle={onToggleSetting}
        onOpenApp={(id) => openApp(id)}
        onLock={onLock}
        onLogout={onLogout}
        onRestart={onRestart}
        onPowerOff={onPowerOff}
      />

      <Dock apps={APPS} windows={windows} focusedApp={focused?.app ?? null} onOpenApp={(id) => openApp(id)} />

      {/* windows */}
      {windows.map((w) => {
        const def = APPS.find((a) => a.id === w.app)!;
        const Comp = def.component;
        const rect = w.maximized
          ? { x: 78, y: 36, w: window.innerWidth - 86, h: window.innerHeight - 44 }
          : { x: w.x, y: w.y, w: w.w, h: w.h };
        return (
          <Window
            key={w.id}
            win={{ ...w, ...rect }}
            title={def.name}
            accent={def.accent}
            icon={APP_ICON[w.app]}
            focused={focused?.id === w.id}
            hidden={w.minimized}
            onFocus={() => focus(w.id)}
            onClose={() => closeApp(w.app)}
            onMinimize={() => patch(w.id, { minimized: true })}
            onToggleMax={() => toggleMax(w)}
            onMove={(x, y) => patch(w.id, { x, y })}
          >
            <Comp api={api} payload={payloads[w.app]} onClose={() => closeApp(w.app)} />
          </Window>
        );
      })}

      {/* context menu */}
      {ctx && (
        <div
          className="animate-popin absolute z-[9500] w-52 overflow-hidden rounded-md border border-edge2 bg-panel/95 py-1 shadow-[0_18px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          style={{ left: ctx.x, top: ctx.y }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {[
            { l: "Open Terminal", fn: () => openApp("terminal") },
            { l: "Open Files", fn: () => openApp("files") },
            { l: "Open kaveri-os repo", fn: () => openApp("files", "github") },
            { l: toggles.scanlines ? "Hide CRT scanlines" : "Show CRT scanlines", fn: () => onToggleSetting("scanlines") },
            { l: "Field Guide", fn: () => openApp("guides") },
            { l: "About Kaveri OS", fn: () => openApp("about") },
          ].map((it) => (
            <button
              key={it.l}
              onClick={() => {
                it.fn();
                setCtx(null);
              }}
              className="block w-full px-4 py-2 text-left text-[12px] text-snow/85 transition hover:bg-raised"
            >
              {it.l}
            </button>
          ))}
          <div className="mt-1 border-t border-edge bg-ink/60 px-4 py-1.5 font-mono text-[9px] tracking-wider text-dim">
            DESKTOP · Kaveri Shell WM
          </div>
        </div>
      )}

      {/* toasts */}
      <div className="absolute right-3 bottom-4 z-[9600] flex w-[320px] flex-col gap-2">
        {toasts.map((t) => {
          const cls =
            t.kind === "success"
              ? "border-tealx/50 text-tealx"
              : t.kind === "warn"
                ? "border-amberx/50 text-amberx"
                : t.kind === "danger"
                  ? "border-redx/50 text-redx"
                  : "border-bluex/50 text-bluex";
          return (
            <div key={t.id} className={`animate-toastin pointer-events-auto flex items-start gap-3 rounded-lg border bg-panel/95 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl ${cls}`}>
              <span className="mt-0.5 shrink-0">
                {t.kind === "warn" || t.kind === "danger" ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
              </span>
              <div className="min-w-0">
                <p className="font-display text-[12px] font-bold tracking-wide text-snow">{t.title}</p>
                {t.body && <p className="mt-0.5 text-[11px] leading-snug text-fog">{t.body}</p>}
              </div>
              <button onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))} className="ml-auto shrink-0 font-mono text-[10px] text-dim transition hover:text-snow">
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* global overlays */}
      {toggles.nightlight && <div className="pointer-events-none absolute inset-0 z-[9700] bg-orange-400/10 mix-blend-multiply" />}
      {toggles.scanlines && <div className="crt-scanlines absolute inset-0 z-[9701]" />}
    </div>
  );
}
