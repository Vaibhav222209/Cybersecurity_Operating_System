import { useState, type ReactNode } from "react";
import type { AppDef, AppId, WindowData } from "../system/types";
import { BrowserIcon, FolderIcon, GuideIcon, InfoIcon, MonitorIcon, TerminalIcon } from "./icons";

const ICONS: Record<AppId, (s: number) => ReactNode> = {
  terminal: (s) => <TerminalIcon size={s} />,
  browser: (s) => <BrowserIcon size={s} />,
  files: (s) => <FolderIcon size={s} />,
  monitor: (s) => <MonitorIcon size={s} />,
  guides: (s) => <GuideIcon size={s} />,
  about: (s) => <InfoIcon size={s} />,
};

interface Props {
  apps: AppDef[];
  windows: WindowData[];
  focusedApp: AppId | null;
  onOpenApp: (id: AppId) => void;
}

export default function Dock({ apps, windows, focusedApp, onOpenApp }: Props) {
  const [hover, setHover] = useState<AppId | null>(null);

  return (
    <div className="absolute top-1/2 left-2 z-[7000] -translate-y-1/2">
      <div className="flex flex-col items-center gap-1.5 rounded-xl border border-edge/80 bg-ink/75 p-1.5 shadow-[0_14px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {apps.map((a) => {
          const running = windows.some((w) => w.app === a.id);
          const focused = focusedApp === a.id && running && !windows.find((w) => w.app === a.id)?.minimized;
          return (
            <div key={a.id} className="relative">
              {hover === a.id && (
                <span className="animate-popin absolute top-1/2 left-[54px] z-10 -translate-y-1/2 rounded border border-edge2 bg-panel/95 px-2.5 py-1 font-display text-[11px] font-semibold tracking-wide whitespace-nowrap text-snow shadow-lg">
                  {a.name}
                  <span className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rotate-45 border-b border-l border-edge2 bg-panel" />
                </span>
              )}
              <button
                onClick={() => onOpenApp(a.id)}
                onMouseEnter={() => setHover(a.id)}
                onMouseLeave={() => setHover(null)}
                className={`group relative grid h-11 w-11 place-items-center rounded-lg border transition-all duration-150 ${
                  focused
                    ? "border-tealx/50 bg-tealx/10 shadow-[0_0_16px_rgba(45,212,191,0.25)]"
                    : "border-edge/70 bg-raised/60 hover:scale-108 hover:border-edge2 hover:bg-lifted"
                }`}
                style={{ color: a.accent }}
              >
                {ICONS[a.id](20)}
                <span
                  className={`absolute -bottom-[7px] h-1 w-1 rounded-full transition ${
                    running ? "bg-tealx shadow-[0_0_6px_var(--color-tealx)]" : "bg-transparent"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
