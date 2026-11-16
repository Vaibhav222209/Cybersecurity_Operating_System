import { useEffect, useState } from "react";
import { KaveriShield } from "../components/icons";

const LINES = [
  "Kaveri BIOS v3.1 — SecureBoot: ENABLED · TPM 2.0 present",
  "[    0.000000] Kaveri kernel 6.6.6-kaveri-secure starting…",
  "[  OK  ] Mounted root /dev/nvme0n1p2 (ext4)",
  "[  OK  ] LUKS2 header verified — volume integrity 100%",
  "[  OK  ] Loaded 1,204 Kaveri Firewall rules (egress allowlist)",
  "[  OK  ] Started kaveri-auditd.service (audit daemon)",
  "[  OK  ] Started kaveri-ids.service (intrusion detection)",
  "[  OK  ] Verified signatures of 8/8 kernel modules",
  "[  OK  ] NetworkManager: wlan0 → kaveri-secure-5G (WPA3-SAE)",
  "[  OK  ] Started Kaveri Display Manager",
  "▸ Handing off to the login gate…",
];

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCount((c) => c + 1), 210);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (count >= LINES.length + 4) onDone();
  }, [count, onDone]);

  return (
    <div className="relative flex h-full cursor-pointer flex-col bg-abyss font-mono" onClick={onDone}>
      <div className="hexgrid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative flex flex-1 flex-col justify-center px-[10vw]">
        <div className="mb-8 flex items-center gap-4">
          <span className="text-tealx"><KaveriShield size={40} /></span>
          <div>
            <p className="font-display text-[20px] font-bold tracking-[0.3em] text-snow">
              KAVERI<span className="text-tealx">·OS</span>
            </p>
            <p className="text-[10px] tracking-[0.34em] text-dim uppercase">secure boot chain — verified</p>
          </div>
        </div>

        <div className="space-y-1.5 text-[12.5px] leading-relaxed">
          {LINES.slice(0, count).map((l, i) => (
            <p key={i} className={`boot-line whitespace-pre-wrap ${l.includes("[  OK  ]") ? "text-fog" : l.startsWith("▸") ? "text-amberx" : "text-mint/90"}`}>
              {l.includes("[  OK  ]") ? (
                <>
                  <span className="text-tealx">[</span>
                  <span className="font-bold text-tealx">  OK  </span>
                  <span className="text-tealx">]</span>
                  {l.slice(8)}
                </>
              ) : (
                l
              )}
            </p>
          ))}
          <span className="cursor-blink inline-block h-4 w-2.5 bg-tealx/90 align-middle" />
        </div>
      </div>

      <div className="relative px-[10vw] pb-10">
        <div className="mb-2 flex justify-between text-[10px] tracking-[0.26em] text-dim uppercase">
          <span>initializing secure environment</span>
          <span>{Math.min(100, Math.round((count / (LINES.length + 3)) * 100))}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-edge">
          <div
            className="h-full rounded-full bg-tealx shadow-[0_0_12px_var(--color-tealx)] transition-all duration-200"
            style={{ width: `${Math.min(100, (count / (LINES.length + 3)) * 100)}%` }}
          />
        </div>
        <p className="mt-3 text-[10px] tracking-[0.2em] text-dim/70 uppercase">click anywhere to skip · crafted by Vaibhav Thakur</p>
      </div>
    </div>
  );
}
