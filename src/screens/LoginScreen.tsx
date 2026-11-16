import { useState, type FormEvent } from "react";
import { WALLPAPER } from "../system/assets";
import { KaveriShield, LockIcon, PowerIcon, ShieldCheck } from "../components/icons";

export default function LoginScreen({ onLogin, onPowerOff }: { onLogin: () => void; onPowerOff: () => void }) {
  const [user, setUser] = useState("kaveri");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake] = useState(0);
  const [phase, setPhase] = useState<"auth" | "decrypt">("auth");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (phase === "decrypt") return;
    if (user.trim().toLowerCase() === "kaveri" && pass === "kaveri") {
      setError("");
      setPhase("decrypt");
      setTimeout(onLogin, 1400);
    } else {
      const n = attempts + 1;
      setAttempts(n);
      setError(`Authentication failed — attempt #${n} logged by kaveri-auditd`);
      setShake((s) => s + 1);
      setPass("");
    }
  };

  return (
    <div className="relative h-full overflow-hidden bg-abyss">
      <img src={WALLPAPER} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50 blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-abyss/70 via-abyss/40 to-abyss/85" />
      <div className="hexgrid absolute inset-0 opacity-50" />
      <div className="vignette absolute inset-0" />

      {/* branding — left */}
      <div className="relative z-10 hidden h-full flex-col justify-center px-[7vw] lg:flex">
        <div className="flex items-center gap-5">
          <span className="pulse-ring grid h-20 w-20 place-items-center rounded-2xl border border-tealx/45 bg-ink/70 text-tealx backdrop-blur">
            <KaveriShield size={46} />
          </span>
          <div>
            <h1 className="font-display text-[44px] leading-none font-bold tracking-[0.08em] text-snow">
              KAVERI<span className="text-tealx">·OS</span>
            </h1>
            <p className="mt-2 font-mono text-[11px] tracking-[0.4em] text-fog uppercase">Hardened Linux Environment</p>
          </div>
        </div>
        <p className="mt-8 max-w-[400px] text-[13.5px] leading-relaxed text-fog">
          v2.1 “Secure Horizon” — verified boot, encrypted home, egress firewall and a full audit trail.
          Everything you do stays inside the sandbox.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {["LUKS2 · AES-256", "FIREWALL · 1,204 RULES", "AUDIT DAEMON · LIVE"].map((c) => (
            <span key={c} className="rounded border border-tealx/30 bg-tealx/[0.07] px-2.5 py-1 font-mono text-[9.5px] tracking-[0.16em] text-mint">
              {c}
            </span>
          ))}
        </div>
        <p className="mt-10 font-mono text-[11px] tracking-[0.18em] text-dim">
          crafted by <span className="font-semibold text-mint">Vaibhav Thakur</span>
        </p>
      </div>

      {/* auth card */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="w-full max-w-[380px] lg:translate-x-[16vw]">
          <form
            key={shake}
            onSubmit={submit}
            className={`rounded-xl border border-edge2/80 bg-ink/85 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl ${shake ? "animate-shake" : "animate-rise"}`}
          >
            <div className="flex flex-col items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-tealx/60 bg-tealx/10 font-display text-[22px] font-bold text-tealx shadow-[0_0_24px_rgba(45,212,191,0.35)]">
                K
              </span>
              <p className="mt-3 font-display text-[17px] font-bold tracking-wide text-snow">kaveri</p>
              <p className="font-mono text-[9.5px] tracking-[0.26em] text-dim uppercase">authorized operator</p>
            </div>

            {phase === "auth" ? (
              <div className="mt-7 space-y-3.5">
                <label className="block">
                  <span className="mb-1.5 block font-display text-[10px] font-bold tracking-[0.22em] text-dim uppercase">User ID</span>
                  <input
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="w-full rounded-md border border-edge2 bg-abyss/80 px-3.5 py-2.5 font-mono text-[13px] text-snow outline-none transition focus:border-tealx/60 focus:shadow-[0_0_0_3px_rgba(45,212,191,0.12)]"
                    spellCheck={false}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-display text-[10px] font-bold tracking-[0.22em] text-dim uppercase">Password</span>
                  <input
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="••••••••"
                    autoFocus
                    className="w-full rounded-md border border-edge2 bg-abyss/80 px-3.5 py-2.5 font-mono text-[13px] text-snow placeholder-dim outline-none transition focus:border-tealx/60 focus:shadow-[0_0_0_3px_rgba(45,212,191,0.12)]"
                  />
                </label>

                {error && (
                  <p className="animate-popin flex items-start gap-2 rounded-md border border-redx/40 bg-redx/[0.08] px-3 py-2.5 text-[11.5px] leading-snug text-redx">
                    <LockIcon size={13} className="mt-0.5 shrink-0" /> {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-md bg-tealx py-2.5 font-display text-[13.5px] font-bold tracking-[0.12em] text-abyss uppercase transition hover:bg-mint hover:shadow-[0_0_24px_rgba(45,212,191,0.4)] active:scale-[0.99]"
                >
                  Unlock session
                </button>

                <p className="rounded-md border border-amberx/30 bg-amberx/[0.06] px-3 py-2 text-center font-mono text-[10.5px] tracking-wide text-amberx/90">
                  demo credentials — usid: kaveri · password: kaveri
                </p>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center pb-2">
                <span className="animate-spin-slow grid h-12 w-12 place-items-center rounded-full border-2 border-tealx/25 border-t-tealx" />
                <p className="mt-4 font-mono text-[11.5px] tracking-wider text-mint">Decrypting /home/kaveri …</p>
                <p className="mt-1 font-mono text-[9.5px] tracking-[0.24em] text-dim uppercase">LUKS2 keyslot 0 · verifying</p>
              </div>
            )}
          </form>

          <p className="mt-4 flex items-center justify-center gap-2 font-mono text-[9.5px] tracking-[0.2em] text-dim uppercase">
            <ShieldCheck size={12} className="text-tealx" /> kaveri display manager · session encrypted end-to-end
          </p>
        </div>
      </div>

      {/* bottom bar */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between border-t border-edge/60 bg-ink/70 px-5 py-2.5 backdrop-blur">
        <span className="font-display text-[11px] font-semibold tracking-[0.2em] text-fog">
          KAVERI OS <span className="text-tealx">2.1</span> · SECURE HORIZON
        </span>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[9.5px] tracking-[0.2em] text-dim uppercase sm:block">session: kaveri-secure · tty1</span>
          <button onClick={onPowerOff} className="grid h-7 w-7 place-items-center rounded-md text-fog transition hover:bg-raised hover:text-redx" aria-label="Power off">
            <PowerIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
