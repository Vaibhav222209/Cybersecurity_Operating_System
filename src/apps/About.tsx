import type { AppProps } from "../system/types";
import { GitHubIcon, GuideIcon, KaveriShield } from "../components/icons";

export default function About({ api }: AppProps) {
  const rows: [string, string][] = [
    ["OS Name", "Kaveri OS 2.1 “Secure Horizon”"],
    ["Kernel", "6.6.6-kaveri-secure (x86_64)"],
    ["Desktop", "Kaveri Shell WM · top bar + dock"],
    ["Browser", "Kaveri Browser 2.1 · egress firewall"],
    ["Terminal", "kaveri-bash 5.2 · 26 hardened commands"],
    ["Security", "LUKS2 home · allowlist · honeypot · auditd"],
    ["License", "MIT"],
  ];
  return (
    <div className="hexgrid flex h-full flex-col items-center overflow-y-auto bg-ink px-8 py-8 text-center">
      <span className="pulse-ring grid h-20 w-20 place-items-center rounded-2xl border border-tealx/45 bg-tealx/10 text-tealx">
        <KaveriShield size={44} />
      </span>
      <h1 className="mt-5 font-display text-[26px] font-bold tracking-wide text-snow">
        Kaveri <span className="text-tealx">OS</span>
      </h1>
      <p className="mt-1 font-mono text-[10px] tracking-[0.3em] text-dim uppercase">Hardened Linux environment · v2.1 Secure Horizon</p>

      <div className="mt-6 w-full max-w-[420px] overflow-hidden rounded-lg border border-edge text-left">
        {rows.map(([k, v], i) => (
          <div key={k} className={`flex items-baseline gap-4 px-4 py-2.5 ${i % 2 ? "bg-panel/60" : "bg-raised/50"}`}>
            <span className="w-24 shrink-0 font-display text-[10.5px] font-bold tracking-[0.14em] text-dim uppercase">{k}</span>
            <span className="font-mono text-[11.5px] text-snow/90">{v}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={() => api.openApp("guides")} className="flex items-center gap-2 rounded-md border border-edge2 bg-panel px-4 py-2.5 text-[12.5px] font-semibold text-snow transition hover:bg-raised">
          <GuideIcon size={15} className="text-amberx" /> Field Guide
        </button>
        <button
          onClick={() => api.openApp("browser", "https://github.com/vaibhavthakur/kaveri-os")}
          className="flex items-center gap-2 rounded-md border border-edge2 bg-panel px-4 py-2.5 text-[12.5px] font-semibold text-snow transition hover:bg-raised"
        >
          <GitHubIcon size={15} /> Source
        </button>
      </div>

      <p className="mt-7 border-t border-edge pt-5 font-mono text-[11px] leading-relaxed tracking-wide text-fog">
        A cybersecurity project — designed, engineered and crafted by
        <span className="mt-1 block font-display text-[15px] font-bold tracking-[0.12em] text-mint">VAIBHAV THAKUR</span>
      </p>
    </div>
  );
}
