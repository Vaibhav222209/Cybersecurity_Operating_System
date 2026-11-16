import type { AppProps } from "../system/types";
import {
  CpuIcon,
  FolderIcon,
  GitHubIcon,
  GuideIcon,
  KaveriShield,
  LockIcon,
  MonitorIcon,
  PowerIcon,
  ShieldCheck,
  TerminalIcon,
  BrowserIcon,
} from "../components/icons";

const STEPS = [
  {
    n: "01",
    icon: <PowerIcon size={20} />,
    title: "Boot",
    color: "#7dd3fc",
    body: (
      <>
        Power on triggers the <b className="text-snow">secure-boot sequence</b>: kernel init, LUKS disk check,
        1,204 firewall rules load, intrusion detection starts. Click anywhere to skip the log.
      </>
    ),
  },
  {
    n: "02",
    icon: <LockIcon size={20} />,
    title: "Login",
    color: "#fbbf24",
    body: (
      <>
        The display manager asks for credentials. Enter user id{" "}
        <code className="rounded border border-amberx/40 bg-amberx/10 px-1.5 py-0.5 font-mono text-[11.5px] text-amberx">kaveri</code>{" "}
        and password{" "}
        <code className="rounded border border-amberx/40 bg-amberx/10 px-1.5 py-0.5 font-mono text-[11.5px] text-amberx">kaveri</code>.
        Wrong attempts are shaken off and logged.
      </>
    ),
  },
  {
    n: "03",
    icon: <ShieldCheck size={20} />,
    title: "Desktop shell",
    color: "#2dd4bf",
    body: (
      <>
        Your encrypted home decrypts and the shell loads: <b className="text-snow">top bar</b> (launcher · clock · power),
        the <b className="text-snow">dock</b> on the left, draggable windows, and this guide.
      </>
    ),
  },
];

const WORKFLOW = [
  { icon: <PowerIcon size={16} />, t: "BOOT", d: "verified kernel" },
  { icon: <LockIcon size={16} />, t: "AUTH", d: "kaveri / kaveri" },
  { icon: <KaveriShield size={16} />, t: "SHELL", d: "WM · dock · topbar" },
  { icon: <TerminalIcon size={16} />, t: "APPS", d: "5 sandboxed apps" },
  { icon: <MonitorIcon size={16} />, t: "SESSION", d: "lock · logout · halt" },
];

const CMDS: [string, string][] = [
  ["help", "every command, explained"],
  ["ls -la · cd · cat · tree", "navigate the virtual FS"],
  ["neofetch", "system fingerprint card"],
  ["nmap kaveri.os", "simulated port scan"],
  ["ping kaveri.os", "latency check, 4 packets"],
  ["ps · ifconfig · uptime", "system introspection"],
  ["github", "open the repo in the browser"],
  ["sudo anything", "…you are not in sudoers"],
];

export default function Guides({ api }: AppProps) {
  return (
    <div className="h-full overflow-y-auto bg-ink">
      {/* header */}
      <div className="hexgrid relative overflow-hidden border-b border-edge">
        <div className="relative px-7 py-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg border border-tealx/40 bg-tealx/10 text-tealx">
              <GuideIcon size={22} />
            </span>
            <div>
              <h1 className="font-display text-[22px] leading-tight font-bold text-snow">Kaveri OS — Field Guide</h1>
              <p className="font-mono text-[10px] tracking-[0.24em] text-dim uppercase">how to open it · how it works · the workflow</p>
            </div>
            <span className="ml-auto hidden rounded-full border border-tealx/40 bg-tealx/10 px-3 py-1 font-mono text-[10px] tracking-wider text-mint sm:block">
              v2.1 · SECURE HORIZON
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-7 py-6">
        {/* how to open */}
        <section>
          <h2 className="flex items-center gap-2.5 font-display text-[14px] font-bold tracking-[0.14em] text-tealx uppercase">
            <span className="h-4 w-1 rounded-full bg-tealx shadow-[0_0_10px_rgba(45,212,191,0.8)]" /> How to open Kaveri OS
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="group relative overflow-hidden rounded-lg border border-edge bg-panel p-5 transition hover:-translate-y-0.5 hover:border-edge2">
                <span className="absolute -top-3 -right-1 font-display text-[64px] font-bold text-lifted select-none">{s.n}</span>
                <span className="relative grid h-10 w-10 place-items-center rounded-md border border-edge bg-ink transition group-hover:scale-105" style={{ color: s.color }}>
                  {s.icon}
                </span>
                <h3 className="relative mt-3.5 font-display text-[15px] font-bold text-snow">{s.title}</h3>
                <p className="relative mt-1.5 text-[12px] leading-relaxed text-fog">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* workflow pipeline */}
        <section>
          <h2 className="flex items-center gap-2.5 font-display text-[14px] font-bold tracking-[0.14em] text-tealx uppercase">
            <span className="h-4 w-1 rounded-full bg-tealx shadow-[0_0_10px_rgba(45,212,191,0.8)]" /> The workflow, end to end
          </h2>
          <div className="mt-4 flex flex-col items-stretch gap-2 rounded-lg border border-edge bg-panel p-5 sm:flex-row sm:items-center">
            {WORKFLOW.map((w, i) => (
              <div key={w.t} className="flex flex-1 items-center gap-2 sm:flex-col sm:gap-3 sm:text-center">
                <div className="flex items-center gap-2 sm:flex-col sm:gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-tealx/35 bg-ink text-tealx shadow-[0_0_18px_rgba(45,212,191,0.12)]">
                    {w.icon}
                  </span>
                  <div className="sm:mt-0">
                    <p className="font-display text-[11.5px] font-bold tracking-[0.14em] text-snow">{w.t}</p>
                    <p className="font-mono text-[9.5px] text-dim">{w.d}</p>
                  </div>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <span className="mx-auto hidden h-px flex-1 bg-gradient-to-r from-tealx/50 to-tealx/10 sm:block" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-fog">
            Session controls in the top bar (<b className="text-snow">kaveri ▸ power menu</b>) loop you back: <i>Lock</i> returns to the
            login gate, <i>Restart</i> replays the boot log, <i>Power off</i> halts the machine cleanly.
          </p>
        </section>

        {/* how it works */}
        <section>
          <h2 className="flex items-center gap-2.5 font-display text-[14px] font-bold tracking-[0.14em] text-tealx uppercase">
            <span className="h-4 w-1 rounded-full bg-tealx shadow-[0_0_10px_rgba(45,212,191,0.8)]" /> How it works under the hood
          </h2>
          <div className="mt-4 space-y-2.5">
            {[
              { icon: <CpuIcon size={17} />, c: "#2dd4bf", t: "Window manager", d: "Every app runs in a draggable, focusable window with z-ordering, minimize and maximize — double-click a title bar to expand it." },
              { icon: <FolderIcon size={17} />, c: "#fbbf24", t: "Virtual filesystem + command engine", d: "The terminal and Files app share one in-memory FS: a full /home/kaveri tree including the github/kaveri-os repository you can read everywhere." },
              { icon: <ShieldCheck size={17} />, c: "#7dd3fc", t: "Firewall routing", d: "The browser resolves only allowlisted hosts (github.com, kaveri.os, docs.kaveri.os). Everything else is blocked — and forcing it engages a honeypot." },
              { icon: <BrowserIcon size={17} />, c: "#e8f0f6", t: "One shared state machine", d: "boot → login → desktop → halted. The top-bar power menu simply moves the machine between these phases." },
            ].map((r) => (
              <div key={r.t} className="flex items-start gap-4 rounded-lg border border-edge bg-panel px-5 py-4 transition hover:border-edge2">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md border border-edge bg-ink" style={{ color: r.c }}>
                  {r.icon}
                </span>
                <div>
                  <h3 className="font-display text-[13.5px] font-bold text-snow">{r.t}</h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-fog">{r.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* cheatsheet */}
        <section>
          <h2 className="flex items-center gap-2.5 font-display text-[14px] font-bold tracking-[0.14em] text-tealx uppercase">
            <span className="h-4 w-1 rounded-full bg-tealx shadow-[0_0_10px_rgba(45,212,191,0.8)]" /> Terminal cheatsheet
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {CMDS.map(([c, d]) => (
              <div key={c} className="flex items-center gap-3 rounded-md border border-edge bg-panel px-4 py-2.5 transition hover:border-tealx/40">
                <code className="shrink-0 rounded border border-tealx/35 bg-tealx/[0.07] px-2 py-1 font-mono text-[11px] text-mint">{c}</code>
                <span className="text-[11.5px] text-fog">{d}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => api.openApp("terminal")}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-tealx px-4 py-2.5 text-[12.5px] font-bold text-abyss transition hover:bg-mint"
          >
            <TerminalIcon size={15} /> Open a terminal now
          </button>
        </section>

        {/* repo + credits */}
        <section className="rounded-lg border border-edge bg-panel p-5">
          <div className="flex flex-wrap items-center gap-4">
            <GitHubIcon size={26} className="text-snow" />
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold text-snow">The full repository ships inside the OS</p>
              <p className="font-mono text-[10.5px] tracking-wider text-dim">Files ▸ github/kaveri-os · or run `github` in the terminal · or open it in the browser</p>
            </div>
            <button
              onClick={() => api.openApp("browser", "https://github.com/vaibhavthakur/kaveri-os")}
              className="ml-auto flex items-center gap-2 rounded-md border border-edge2 bg-raised px-4 py-2 text-[12px] font-semibold text-snow transition hover:bg-lifted"
            >
              <GitHubIcon size={14} /> View repo
            </button>
          </div>
          <div className="mt-4 flex items-center gap-3 border-t border-edge pt-4">
            <KaveriShield size={22} className="text-tealx" />
            <p className="font-mono text-[11px] tracking-wide text-fog">
              Kaveri OS v2.1 “Secure Horizon” — designed & crafted by <span className="font-bold text-mint">Vaibhav Thakur</span> · MIT license
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
