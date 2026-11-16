import { useEffect, useRef, useState } from "react";
import type { AppProps } from "../system/types";
import { CpuIcon, KaveriShield, PulseIcon, ShieldCheck } from "../components/icons";

function Spark({ data, color, h = 34 }: { data: number[]; color: string; h?: number }) {
  const w = 120;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / 100) * (h - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" opacity={0.9} />
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity={0.09} />
    </svg>
  );
}

function Gauge({ label, value, color }: { label: string; value: number; color: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="92" height="92" viewBox="0 0 92 92" className="-rotate-90">
          <circle cx="46" cy="46" r={r} fill="none" stroke="#1c2937" strokeWidth="7" />
          <circle
            cx="46" cy="46" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c - (value / 100) * c}
            style={{ transition: "stroke-dashoffset 1.2s ease", filter: `drop-shadow(0 0 6px ${color}66)` }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-mono text-[15px] font-bold" style={{ color }}>
          {Math.round(value)}%
        </span>
      </div>
      <span className="mt-1.5 font-display text-[10px] font-semibold tracking-[0.22em] text-fog uppercase">{label}</span>
    </div>
  );
}

const THREAT_POOL = [
  ["BLOCKED", "egress to ads.malware.net dropped (rule #447)", "warn"],
  ["BLOCKED", "tracker pixel from metrics.phish.xyz neutralized", "warn"],
  ["HONEYPOT", "phish-login.xyz lured into sandbox · bait token issued", "danger"],
  ["AUDIT", "login gate integrity re-verified · checksums OK", "ok"],
  ["BLOCKED", "port scan from 185.220.101.44 reflected", "warn"],
  ["OK", "TLS session renegotiated · TLS 1.3 · HSTS enforced", "ok"],
  ["QUARANTINE", "hash e3b0c44298fc1c14 isolated from Downloads", "danger"],
] as const;

interface Threat {
  t: string;
  tag: string;
  msg: string;
  sev: string;
}

const PROCS = [
  ["kaveri-init", "verified boot service", 0.4],
  ["kaveri-firewalld", "egress allowlist daemon", 2.1],
  ["kaveri-auditd", "session audit logger", 0.8],
  ["kaveri-shell-wm", "window manager", 4.6],
  ["kaveri-browser", "sandboxed web process", 11.2],
  ["kaveri-bash", "hardened shell", 0.2],
  ["kaveri-cryptd", "LUKS2 keyring guard", 1.5],
  ["kaveri-netmon", "network watchdog", 0.9],
] as const;

export default function Monitor({ api }: AppProps) {
  const [tab, setTab] = useState<"overview" | "procs" | "security">("overview");
  const [cpu, setCpu] = useState<number[]>(() => Array.from({ length: 28 }, () => 18 + Math.random() * 20));
  const [mem, setMem] = useState<number[]>(() => Array.from({ length: 28 }, () => 30 + Math.random() * 8));
  const [net, setNet] = useState<number[]>(() => Array.from({ length: 28 }, () => 5 + Math.random() * 30));
  const [threats, setThreats] = useState<Threat[]>([]);
  const [ticks, setTicks] = useState(0);
  const poolIdx = useRef(0);
  const start = useRef(Date.now());

  useEffect(() => {
    const t = setInterval(() => {
      const walk = (arr: number[], base: number, amp: number) => {
        const last = arr[arr.length - 1];
        const next = Math.min(96, Math.max(3, last + (Math.random() - 0.5) * amp + (base - last) * 0.08));
        return [...arr.slice(1), next];
      };
      setCpu((a) => walk(a, 24, 26));
      setMem((a) => walk(a, 34, 6));
      setNet((a) => walk(a, 18, 34));
      setTicks((x) => x + 1);
    }, 1600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const push = () => {
      const [tag, msg, sev] = THREAT_POOL[poolIdx.current % THREAT_POOL.length];
      poolIdx.current++;
      const t = new Date().toLocaleTimeString([], { hour12: false });
      setThreats((prev) => [{ t, tag, msg, sev }, ...prev].slice(0, 8));
    };
    push();
    const t = setInterval(push, 4200);
    return () => clearInterval(t);
  }, []);

  const up = Math.floor((Date.now() - start.current) / 1000);
  const last = (a: number[]) => a[a.length - 1];

  const SEV_CLS: Record<string, string> = {
    warn: "text-amberx border-amberx/40 bg-amberx/10",
    danger: "text-redx border-redx/40 bg-redx/10",
    ok: "text-mint border-tealx/40 bg-tealx/10",
  };

  return (
    <div className="flex h-full flex-col bg-ink">
      {/* tabs */}
      <div className="flex items-center gap-1 border-b border-edge bg-panel/60 px-3 pt-2">
        {(
          [
            ["overview", "Overview"],
            ["procs", "Processes"],
            ["security", "Security"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded-t-md border border-b-0 px-4 py-2 font-display text-[11.5px] font-semibold tracking-wide transition ${
              tab === id ? "border-edge bg-ink text-tealx" : "border-transparent text-fog hover:text-snow"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto mr-2 flex items-center gap-2 font-mono text-[9.5px] tracking-[0.2em] text-dim">
          <span className="animate-throb h-1.5 w-1.5 rounded-full bg-tealx shadow-[0_0_8px_var(--color-tealx)]" /> LIVE TELEMETRY
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {tab === "overview" && (
          <div className="animate-popin">
            <div className="grid grid-cols-3 gap-4">
              <Gauge label="CPU" value={last(cpu)} color="#2dd4bf" />
              <Gauge label="Memory" value={last(mem)} color="#fbbf24" />
              <Gauge label="Network" value={last(net)} color="#7dd3fc" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { l: "CPU · Kaveri V-Core 9", d: cpu, c: "#2dd4bf", v: `${(1.2 + last(cpu) / 30).toFixed(2)} GHz · 8 cores` },
                { l: "RAM · 16384 MiB", d: mem, c: "#fbbf24", v: `${Math.round((last(mem) / 100) * 16384)} MiB used` },
                { l: "NET · wlan0", d: net, c: "#7dd3fc", v: `${(last(net) * 1.7).toFixed(1)} Mb/s encrypted` },
              ].map((card) => (
                <div key={card.l} className="rounded-lg border border-edge bg-panel p-4">
                  <p className="font-display text-[10.5px] font-bold tracking-[0.18em] text-fog uppercase">{card.l}</p>
                  <div className="mt-3"><Spark data={card.d} color={card.c} /></div>
                  <p className="mt-2 font-mono text-[10.5px] text-dim">{card.v}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-edge bg-panel p-4 font-mono text-[11.5px] leading-loose text-fog">
                <p className="mb-2 font-display text-[10.5px] font-bold tracking-[0.18em] text-fog uppercase">System</p>
                <p><span className="inline-block w-24 text-dim">OS</span><span className="text-snow">Kaveri OS 2.1 “Secure Horizon”</span></p>
                <p><span className="inline-block w-24 text-dim">Kernel</span><span className="text-snow">6.6.6-kaveri-secure</span></p>
                <p><span className="inline-block w-24 text-dim">Uptime</span><span className="text-snow">{Math.floor(up / 60)}m {up % 60}s</span></p>
                <p><span className="inline-block w-24 text-dim">Session</span><span className="text-mint">kaveri · LUKS2 decrypted</span></p>
              </div>
              <div className="flex flex-col justify-between rounded-lg border border-tealx/30 bg-tealx/[0.05] p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-lg border border-tealx/40 bg-ink text-tealx"><CpuIcon size={22} /></span>
                  <div>
                    <p className="font-display text-[14px] font-bold text-snow">Shield integrity 100%</p>
                    <p className="font-mono text-[10px] tracking-wider text-dim">0 breaches · 1,204 firewall rules · audit clean</p>
                  </div>
                </div>
                <p className="mt-3 border-t border-tealx/20 pt-2.5 font-mono text-[10.5px] text-fog">
                  crafted by <span className="font-semibold text-mint">Vaibhav Thakur</span> · cybersecurity project
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === "procs" && (
          <div className="animate-popin overflow-hidden rounded-lg border border-edge">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="bg-raised font-display text-[10px] tracking-[0.18em] text-dim uppercase">
                  <th className="px-4 py-2.5 font-semibold">PID</th>
                  <th className="px-4 py-2.5 font-semibold">Process</th>
                  <th className="px-4 py-2.5 font-semibold">Role</th>
                  <th className="px-4 py-2.5 text-right font-semibold">CPU%</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {PROCS.map(([name, role, base], i) => {
                  const jitter = (base + Math.abs(Math.sin((ticks + i) * 1.7)) * base * 0.6).toFixed(1);
                  return (
                    <tr key={name} className="border-t border-edge/50 font-mono transition hover:bg-raised/50">
                      <td className="px-4 py-2.5 text-dim">{(i + 1) * 47 + 12}</td>
                      <td className="px-4 py-2.5 font-semibold text-snow">{name}</td>
                      <td className="px-4 py-2.5 text-fog">{role}</td>
                      <td className="px-4 py-2.5 text-right text-tealx">{jitter}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="rounded border border-tealx/40 bg-tealx/10 px-1.5 py-0.5 text-[9px] tracking-wider text-mint">RUNNING</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="border-t border-edge bg-panel px-4 py-2 font-mono text-[10px] tracking-wider text-dim">
              {PROCS.length} processes · all signatures verified · nothing runs outside the sandbox
            </div>
          </div>
        )}

        {tab === "security" && (
          <div className="animate-popin space-y-4">
            <div className="flex items-center gap-4 rounded-lg border border-tealx/40 bg-tealx/[0.06] p-4">
              <span className="pulse-ring grid h-12 w-12 shrink-0 place-items-center rounded-full border border-tealx/50 bg-ink text-tealx">
                <ShieldCheck size={24} />
              </span>
              <div>
                <p className="font-display text-[16px] font-bold tracking-wide text-mint">SHIELD ACTIVE</p>
                <p className="font-mono text-[10.5px] tracking-wider text-fog">firewall · intrusion detection · audit daemon — all green</p>
              </div>
              <button
                onClick={() => api.notify("Kaveri Firewall", "full ruleset re-verified · 1,204 rules OK", "success")}
                className="ml-auto shrink-0 rounded-md border border-tealx/50 bg-tealx/10 px-3.5 py-2 text-[11.5px] font-semibold text-mint transition hover:bg-tealx/20"
              >
                Run audit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["14", "threats blocked today", "text-amberx"],
                ["1,204", "firewall rules loaded", "text-mint"],
                ["2", "honeypots engaged", "text-redx"],
                ["0", "failed logins (session)", "text-mint"],
              ].map(([n, l, c]) => (
                <div key={l} className="rounded-lg border border-edge bg-panel p-3.5 text-center">
                  <p className={`font-display text-[22px] font-bold ${c}`}>{n}</p>
                  <p className="mt-0.5 text-[10.5px] text-fog">{l}</p>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-lg border border-edge">
              <div className="flex items-center gap-2 border-b border-edge bg-raised px-4 py-2.5">
                <PulseIcon size={14} className="text-tealx" />
                <span className="font-display text-[11px] font-bold tracking-[0.18em] text-snow uppercase">Live threat feed</span>
                <span className="ml-auto font-mono text-[9.5px] tracking-wider text-dim">kaveri-auditd · /var/log/kaveri/audit.log</span>
              </div>
              <div className="divide-y divide-edge/50 bg-panel">
                {threats.map((th, i) => (
                  <div key={`${th.t}-${i}`} className={`flex items-center gap-3 px-4 py-2.5 font-mono text-[11px] ${i === 0 ? "animate-popin" : ""}`}>
                    <span className="shrink-0 text-dim">{th.t}</span>
                    <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] tracking-wider ${SEV_CLS[th.sev]}`}>{th.tag}</span>
                    <span className="truncate text-fog">{th.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-edge bg-panel p-4">
              <KaveriShield size={26} className="shrink-0 text-tealx" />
              <p className="text-[12px] leading-relaxed text-fog">
                This console mirrors the OS security model: egress allowlist, honeypot sandboxing and full audit logging.
                Security research welcome — coordinated disclosure to <span className="text-mint">Vaibhav Thakur</span> via SECURITY.md.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
