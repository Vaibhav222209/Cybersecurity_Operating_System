import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AppDef, AppId, WindowData } from "../system/types";
import {
  BatteryIcon,
  KaveriShield,
  LockIcon,
  LogoutIcon,
  PowerIcon,
  RestartIcon,
  ShieldCheck,
  ShieldAlert,
  VolumeIcon,
  WifiIcon,
} from "./icons";

export interface Toggles {
  firewall: boolean;
  wifi: boolean;
  nightlight: boolean;
  scanlines: boolean;
}

interface Props {
  apps: AppDef[];
  windows: WindowData[];
  focusedApp: AppId | null;
  toggles: Toggles;
  onToggle: (key: keyof Toggles) => void;
  onOpenApp: (id: AppId) => void;
  onLock: () => void;
  onLogout: () => void;
  onRestart: () => void;
  onPowerOff: () => void;
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function Dropdown({ onClose, children, align = "left", width = 260 }: { onClose: () => void; children: ReactNode; align?: "left" | "right"; width?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("mousedown", h);
    window.addEventListener("keydown", k);
    return () => {
      window.removeEventListener("mousedown", h);
      window.removeEventListener("keydown", k);
    };
  }, [onClose]);
  return (
    <div
      ref={ref}
      style={{ width }}
      className={`animate-popin absolute top-[38px] z-[9000] overflow-hidden rounded-md border border-edge2 bg-panel/95 shadow-[0_18px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl ${
        align === "right" ? "right-0" : "left-0"
      }`}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

export default function TopBar(p: Props) {
  const now = useClock();
  const [menu, setMenu] = useState<null | "launcher" | "quick" | "power">(null);
  const focusedDef = p.apps.find((a) => a.id === p.focusedApp);

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  const ToggleRow = ({ k, label, desc }: { k: keyof Toggles; label: string; desc: string }) => (
    <button
      onClick={() => p.onToggle(k)}
      className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition hover:bg-raised ${p.toggles[k] ? "" : "opacity-60"}`}
    >
      <span
        className={`relative h-4.5 w-8 shrink-0 rounded-full border transition ${
          p.toggles[k] ? "border-tealx/60 bg-tealx/25" : "border-edge2 bg-ink"
        }`}
      >
        <span
          className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full transition-all ${
            p.toggles[k] ? "left-[16px] bg-tealx shadow-[0_0_8px_rgba(45,212,191,0.8)]" : "left-[2px] bg-dim"
          }`}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] font-medium text-snow">{label}</span>
        <span className="block truncate text-[10.5px] text-dim">{desc}</span>
      </span>
      <span className={`font-mono text-[9.5px] uppercase tracking-widest ${p.toggles[k] ? "text-tealx" : "text-dim"}`}>
        {p.toggles[k] ? "on" : "off"}
      </span>
    </button>
  );

  return (
    <div className="absolute inset-x-0 top-0 z-[8000] flex h-8 items-stretch border-b border-edge/80 bg-ink/85 font-display backdrop-blur-lg select-none">
      {/* ── launcher ── */}
      <div className="relative flex items-center">
        <button
          onClick={() => setMenu(menu === "launcher" ? null : "launcher")}
          className={`flex h-full items-center gap-2 border-r border-edge/70 px-3.5 transition hover:bg-raised ${
            menu === "launcher" ? "bg-raised" : ""
          }`}
        >
          <span className="text-tealx">
            <KaveriShield size={15} />
          </span>
          <span className="text-[12px] font-bold tracking-[0.22em] text-snow">
            KAVERI<span className="text-tealx">·OS</span>
          </span>
        </button>

        {menu === "launcher" && (
          <Dropdown onClose={() => setMenu(null)} width={300}>
            <div className="border-b border-edge bg-ink/60 px-3.5 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-dim">Applications</p>
            </div>
            <div className="grid grid-cols-2 gap-1 p-2">
              {p.apps.map((a) => {
                const Icon = a.id === "browser" ? BrowserGlyph : AppGlyph;
                return (
                  <button
                    key={a.id}
                    onClick={() => {
                      p.onOpenApp(a.id);
                      setMenu(null);
                    }}
                    className="group flex items-center gap-2.5 rounded-md border border-transparent px-2.5 py-2.5 text-left transition hover:border-edge hover:bg-raised"
                  >
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-edge bg-ink transition group-hover:scale-105"
                      style={{ color: a.accent }}
                    >
                      <Icon def={a} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[12px] font-semibold text-snow">{a.name}</span>
                      <span className="block truncate text-[9.5px] text-dim">{a.tagline}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between border-t border-edge bg-ink/60 px-3.5 py-2">
              <span className="font-mono text-[9.5px] tracking-wider text-dim">v2.1 · SECURE HORIZON</span>
              <span className="font-mono text-[9.5px] tracking-wider text-tealx/80">by Vaibhav Thakur</span>
            </div>
          </Dropdown>
        )}
      </div>

      {/* ── running windows ── */}
      <div className="hidden min-w-0 flex-1 items-center gap-1 overflow-hidden px-3 md:flex">
        {p.windows.map((w) => {
          const def = p.apps.find((a) => a.id === w.app)!;
          const focused = w.app === p.focusedApp && !w.minimized;
          return (
            <button
              key={w.id}
              onClick={() => p.onOpenApp(w.app)}
              className={`flex max-w-[180px] items-center gap-1.5 rounded px-2.5 py-1 text-[11px] transition ${
                focused ? "bg-raised text-snow shadow-[inset_0_-1.5px_0_var(--color-tealx)]" : "text-fog hover:bg-raised/60 hover:text-snow"
              } ${w.minimized ? "opacity-50" : ""}`}
            >
              <span style={{ color: def.accent }} className="shrink-0">
                <AppGlyph def={def} size={11} />
              </span>
              <span className="truncate">{w.title}</span>
            </button>
          );
        })}
        {p.windows.length === 0 && (
          <span className="mx-auto hidden items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-dim lg:flex">
            <span className="h-1 w-1 rounded-full bg-tealx/70 shadow-[0_0_6px_var(--color-tealx)]" />
            SECURE SESSION ACTIVE — {focusedDef ? focusedDef.name.toUpperCase() : "DESKTOP"}
          </span>
        )}
      </div>

      {/* ── tray ── */}
      <div className="flex items-center gap-0.5 pl-1">
        <div className="relative flex h-full items-center">
          <button
            onClick={() => setMenu(menu === "quick" ? null : "quick")}
            className={`flex h-full items-center gap-2.5 px-3 transition hover:bg-raised ${menu === "quick" ? "bg-raised" : ""}`}
          >
            <span className={p.toggles.firewall ? "text-tealx" : "text-redx"}>
              {p.toggles.firewall ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
            </span>
            <span className={p.toggles.wifi ? "text-fog" : "text-dim line-through"}>
              <WifiIcon size={13} />
            </span>
            <span className="flex items-center gap-1 text-fog">
              <VolumeIcon size={13} />
            </span>
            <span className="flex items-center gap-1 text-fog">
              <BatteryIcon size={15} />
              <span className="font-mono text-[10px]">87%</span>
            </span>
          </button>

          {menu === "quick" && (
            <Dropdown onClose={() => setMenu(null)} align="right" width={272}>
              <div className="border-b border-edge bg-ink/60 px-3.5 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-dim">Quick Settings</p>
              </div>
              <div className="divide-y divide-edge/60 py-1">
                <ToggleRow k="firewall" label="Kaveri Firewall" desc="1,204 rules · egress allowlist" />
                <ToggleRow k="wifi" label="Network · wlan0" desc="kaveri-secure-5G · WPA3" />
                <ToggleRow k="nightlight" label="Night Light" desc="warm phosphor filter" />
                <ToggleRow k="scanlines" label="CRT Scanlines" desc="retro terminal overlay" />
              </div>
              <div className="border-t border-edge bg-ink/60 px-3.5 py-2 font-mono text-[9.5px] tracking-wider text-dim">
                KERNEL 6.6.6-KAVERI-SECURE · UPTIME {Math.floor((Date.now() % 86400000) / 3600000)}h
              </div>
            </Dropdown>
          )}
        </div>

        {/* clock */}
        <div className="hidden h-full items-center gap-2 border-l border-edge/70 px-3 sm:flex">
          <span className="text-[11px] font-semibold tracking-wide text-snow">{time}</span>
          <span className="text-[10px] text-dim">{date}</span>
        </div>

        {/* power */}
        <div className="relative flex h-full items-center">
          <button
            onClick={() => setMenu(menu === "power" ? null : "power")}
            className={`flex h-full items-center gap-2 border-l border-edge/70 px-3 transition hover:bg-raised ${menu === "power" ? "bg-raised" : ""}`}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full border border-tealx/40 bg-tealx/10 text-[9px] font-bold text-tealx">
              K
            </span>
            <span className="hidden font-mono text-[10.5px] text-fog sm:block">kaveri</span>
          </button>

          {menu === "power" && (
            <Dropdown onClose={() => setMenu(null)} align="right" width={230}>
              <div className="border-b border-edge bg-ink/60 px-3.5 py-3">
                <p className="text-[12px] font-semibold text-snow">kaveri@kaveri-os</p>
                <p className="font-mono text-[9.5px] tracking-wider text-dim">HOME ENCRYPTED · LUKS2 · AES-256</p>
              </div>
              <div className="py-1">
                {[
                  { icon: <LockIcon size={14} />, label: "Lock screen", fn: p.onLock },
                  { icon: <LogoutIcon size={14} />, label: "Log out…", fn: p.onLogout },
                  { icon: <RestartIcon size={14} />, label: "Restart…", fn: p.onRestart },
                  { icon: <PowerIcon size={14} />, label: "Power off…", fn: p.onPowerOff, danger: true },
                ].map((it) => (
                  <button
                    key={it.label}
                    onClick={() => {
                      setMenu(null);
                      it.fn();
                    }}
                    className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-[12.5px] transition hover:bg-raised ${
                      it.danger ? "text-redx" : "text-snow/85"
                    }`}
                  >
                    <span className={it.danger ? "text-redx" : "text-fog"}>{it.icon}</span>
                    {it.label}
                  </button>
                ))}
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
}

import { BrowserIcon } from "./icons";
function BrowserGlyph({ def }: { def: AppDef }) {
  return <BrowserIcon size={15} aria-label={def.name} />;
}
import { TerminalIcon, FolderIcon, MonitorIcon, GuideIcon, InfoIcon } from "./icons";
function AppGlyph({ def, size = 15 }: { def: AppDef; size?: number }) {
  const map: Record<string, ReactNode> = {
    terminal: <TerminalIcon size={size} />,
    browser: <BrowserIcon size={size} />,
    files: <FolderIcon size={size} />,
    monitor: <MonitorIcon size={size} />,
    guides: <GuideIcon size={size} />,
    about: <InfoIcon size={size} />,
  };
  return <>{map[def.id]}</>;
}
