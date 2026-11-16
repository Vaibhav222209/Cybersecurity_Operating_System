import { useRef, type ReactNode, type PointerEvent } from "react";
import type { WindowData } from "../system/types";
import { KaveriShield } from "./icons";

interface Props {
  win: WindowData;
  title: string;
  accent: string;
  focused: boolean;
  icon?: ReactNode;
  headerExtra?: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
  onMove: (x: number, y: number) => void;
  hidden?: boolean;
  children: ReactNode;
}

export default function Window({
  win,
  title,
  accent,
  focused,
  icon,
  headerExtra,
  onFocus,
  onClose,
  onMinimize,
  onToggleMax,
  onMove,
  hidden,
  children,
}: Props) {
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (win.maximized) return;
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    onMove(
      Math.min(Math.max(e.clientX - drag.current.dx, -win.w + 120), window.innerWidth - 80),
      Math.min(Math.max(e.clientY - drag.current.dy, 34), window.innerHeight - 60)
    );
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <section
      className={`animate-winopen absolute flex flex-col overflow-hidden rounded-lg border bg-panel/95 backdrop-blur-md transition-shadow duration-200 ${hidden ? "hidden" : ""} ${
        focused ? "border-edge2 win-shadow" : "border-edge opacity-[0.96] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
      }`}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }}
      onPointerDown={onFocus}
    >
      {/* title bar */}
      <header
        className={`panel-edge flex h-9 shrink-0 cursor-default items-center gap-3 border-b px-3 select-none ${
          focused ? "border-edge bg-raised/90" : "border-edge/70 bg-panel"
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={onToggleMax}
      >
        <div className="group flex items-center gap-2">
          <button
            aria-label="Close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClose}
            className="grid h-3.5 w-3.5 place-items-center rounded-full border border-redx/50 bg-redx/80 text-[8px] text-transparent transition hover:text-black/70"
          >
            ✕
          </button>
          <button
            aria-label="Minimize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onMinimize}
            className="grid h-3.5 w-3.5 place-items-center rounded-full border border-amberx/50 bg-amberx/80 text-[8px] text-transparent transition hover:text-black/70"
          >
            –
          </button>
          <button
            aria-label="Maximize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onToggleMax}
            className={`grid h-3.5 w-3.5 place-items-center rounded-full border border-tealx/50 bg-tealx/80 text-[8px] text-transparent transition hover:text-black/70 ${
              win.maximized ? "ring-2 ring-tealx/40" : ""
            }`}
          >
            +
          </button>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          <span style={{ color: accent }} className="shrink-0">
            {icon ?? <KaveriShield size={14} />}
          </span>
          <span
            className={`truncate font-display text-[12px] font-semibold tracking-[0.08em] ${
              focused ? "text-snow" : "text-dim"
            }`}
          >
            {title}
          </span>
        </div>

        <div className="flex w-[64px] items-center justify-end">{headerExtra}</div>
      </header>

      {/* body */}
      <div className="relative min-h-0 flex-1">{children}</div>

      {/* focused accent line */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}66, transparent)`, opacity: focused ? 1 : 0 }}
      />
    </section>
  );
}
