import { useState } from "react";
import BootScreen from "./screens/BootScreen";
import LoginScreen from "./screens/LoginScreen";
import Desktop from "./components/Desktop";
import { PowerIcon } from "./components/icons";

type Phase = "boot" | "login" | "desktop" | "off";

export default function App() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [session, setSession] = useState(0);
  const [bootKey, setBootKey] = useState(0);

  return (
    <div className="h-full w-full overflow-hidden bg-abyss font-body text-snow">
      {phase === "boot" && <BootScreen key={`boot-${bootKey}`} onDone={() => setPhase("login")} />}

      {phase === "login" && (
        <LoginScreen
          onLogin={() => {
            setSession((s) => s + 1);
            setPhase("desktop");
          }}
          onPowerOff={() => setPhase("off")}
        />
      )}

      {phase === "desktop" && (
        <Desktop
          key={`session-${session}`}
          onLock={() => setPhase("login")}
          onLogout={() => setPhase("login")}
          onRestart={() => {
            setBootKey((k) => k + 1);
            setPhase("boot");
          }}
          onPowerOff={() => setPhase("off")}
        />
      )}

      {phase === "off" && (
        <div className="flex h-full flex-col items-center justify-center bg-abyss">
          <button
            onClick={() => {
              setBootKey((k) => k + 1);
              setPhase("boot");
            }}
            className="group flex flex-col items-center"
          >
            <span className="pulse-ring grid h-24 w-24 place-items-center rounded-full border-2 border-edge2 text-dim transition group-hover:border-tealx/60 group-hover:text-tealx group-hover:shadow-[0_0_40px_rgba(45,212,191,0.25)]">
              <PowerIcon size={40} />
            </span>
            <span className="mt-6 font-display text-[15px] font-bold tracking-[0.3em] text-fog uppercase transition group-hover:text-snow">
              Power on
            </span>
          </button>
          <p className="mt-10 font-mono text-[10px] tracking-[0.3em] text-dim/70 uppercase">
            kaveri os halted cleanly — it is now safe to close this tab
          </p>
          <p className="mt-2 font-mono text-[9.5px] tracking-[0.2em] text-dim/50 uppercase">crafted by Vaibhav Thakur</p>
        </div>
      )}
    </div>
  );
}
