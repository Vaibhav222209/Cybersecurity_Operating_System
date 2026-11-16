import { useEffect, useRef, useState } from "react";
import type { AppProps } from "../system/types";
import { getNode, prettyPath, resolvePath, HOME, type FsNode } from "../system/fs";

interface Line {
  text: string;
  cls?: "cmd" | "err" | "ok" | "warn" | "dim" | "sys" | "art";
}

const COMMANDS: Record<string, string> = {
  help: "list available commands",
  ls: "list directory contents (-a -l)",
  cd: "change directory",
  pwd: "print working directory",
  cat: "print file contents",
  tree: "show directory tree",
  clear: "clear the terminal",
  echo: "print text ($USER supported)",
  date: "current date & time",
  whoami: "print current user",
  id: "print user identity",
  hostname: "print machine name",
  uname: "kernel information (-a)",
  uptime: "session uptime",
  history: "command history",
  neofetch: "system fingerprint",
  banner: "KAVERI splash art",
  ping: "ping a host (simulated)",
  nmap: "port scan (simulated)",
  ifconfig: "network interfaces",
  ps: "process table",
  open: "launch app: browser|files|monitor|guides|about",
  github: "open the kaveri-os repo in the browser",
  sudo: "execute as superuser",
  hack: "try it… --target=anything",
  exit: "close the terminal",
};

const KAVERI_ART = [
  " ██   ██  █████  ██    ██ ███████ ██████  ██",
  " ██  ██  ██   ██ ██    ██ ██      ██   ██ ██",
  " █████   ███████ ██    ██ █████   ██████  ██",
  " ██  ██  ██   ██  ██  ██  ██      ██   ██ ██",
  " ██   ██ ██   ██   ████   ███████ ██   ██ ██",
];

export default function Terminal({ api, onClose }: AppProps) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState<string[]>([...HOME]);
  const [hist, setHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const busy = useRef(false);
  const born = useRef(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cwdRef = useRef(cwd);
  cwdRef.current = cwd;

  const print = (ls: Line[]) => setLines((prev) => [...prev, ...ls]);
  const promptStr = () => `kaveri@kaveri-os:${prettyPath(cwdRef.current)}$`;

  useEffect(() => {
    print([
      { text: "Kaveri OS 2.1 “Secure Horizon” — hardened shell (kaveri-bash 5.2)", cls: "sys" },
      { text: "Firewall active · 1,204 rules loaded · audit daemon listening", cls: "dim" },
      { text: "Type `help` for commands · `neofetch` for system info · crafted by Vaibhav Thakur", cls: "dim" },
      { text: "" },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  async function runNmap(target: string) {
    busy.current = true;
    print([{ text: `Starting Nmap 7.95 ( https://kaveri.os/nmap ) — target: ${target}`, cls: "dim" }]);
    await wait(600);
    print([{ text: `Scanning ${target} [1000 ports] …`, cls: "dim" }]);
    const rows: [string, number, string][] = [
      ["PORT      STATE    SERVICE", 0, "ok"],
      ["22/tcp    open     ssh        (Kaveri Guard · key-only auth)", 400, "out"],
      ["443/tcp   open     https      (TLS 1.3 · HSTS enforced)", 420, "out"],
      ["3389/tcp  closed   rdp        (service disabled by policy)", 380, "warn"],
      ["8080/tcp  filtered http-alt   (firewall drop rule #447)", 450, "warn"],
    ];
    for (const [t, d, c] of rows) {
      await wait(d);
      print([{ text: t, cls: c === "ok" ? "ok" : c === "warn" ? "warn" : undefined }]);
    }
    await wait(300);
    print([
      { text: "" },
      { text: "Nmap done: 1 host up — 2 open · 1 closed · 1 filtered", cls: "sys" },
      { text: "Verdict: attack surface minimal. Shield integrity 100%.", cls: "ok" },
    ]);
    busy.current = false;
  }

  async function runPing(host: string) {
    busy.current = true;
    print([{ text: `PING ${host} (10.0.2.15) 56(84) bytes of data.`, cls: "dim" }]);
    let total = 0;
    for (let i = 0; i < 4; i++) {
      await wait(620);
      const t = 11 + Math.round(Math.random() * 24);
      total += t;
      print([{ text: `64 bytes from ${host}: icmp_seq=${i + 1} ttl=64 time=${t}.${i} ms` }]);
    }
    print([
      { text: "" },
      { text: `--- ${host} ping statistics ---`, cls: "dim" },
      { text: `4 packets transmitted, 4 received, 0% packet loss, avg ${(total / 4).toFixed(1)} ms`, cls: "ok" },
    ]);
    busy.current = false;
  }

  async function runHack() {
    busy.current = true;
    const seq: [string, Line["cls"], number][] = [
      ["[ kaveri-sploit v2.1 ] initializing exploit framework…", "dim", 500],
      ["[ + ] loading modules: payload/aes-bypass · priv-esc/ladder …", "dim", 550],
      ["[ + ] scanning perimeter… found 3 guarded ports", "sys", 600],
      ["[ ~ ] attempting handshake with kernel…", "sys", 700],
    ];
    for (const [t, c, d] of seq) {
      await wait(d);
      print([{ text: t, cls: c }]);
    }
    for (const pct of [12, 34, 57, 78, 91]) {
      await wait(340);
      const bar = "█".repeat(Math.round(pct / 5)) + "░".repeat(20 - Math.round(pct / 5));
      setLines((prev) => [
        ...prev.filter((l) => !l.text.startsWith("[#####") && !l.text.startsWith("[##") && !l.cls?.includes("bar")),
        { text: `[${bar}] ${pct}% bypassing firewall…`, cls: "warn" },
      ]);
    }
    await wait(600);
    print([
      { text: "" },
      { text: "ACCESS DENIED.", cls: "err" },
      { text: "Kaveri Firewall contained the attempt and issued a honeypot token.", cls: "warn" },
      { text: "Nice try — ethical hacking only in this system. (try `help`)", cls: "dim" },
    ]);
    busy.current = false;
  }

  function listDir(node: FsNode, flags: string) {
    const all = flags.includes("a");
    const long = flags.includes("l");
    const kids = (node.children || []).filter((c) => all || !c.name.startsWith("."));
    if (kids.length === 0) return;
    if (long) {
      print([
        { text: `total ${kids.length}`, cls: "dim" },
        ...kids.map((c) => ({
          text: `${c.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--"}  kaveri kaveri  ${(c.size || "4.0 KB").padEnd(8)} ${c.modified || "2026-02-01"}  ${c.name}${c.type === "dir" ? "/" : ""}`,
          cls: c.type === "dir" ? ("ok" as const) : undefined,
        })),
      ]);
    } else {
      print(
        kids.map((c) => ({
          text: c.name + (c.type === "dir" ? "/" : ""),
          cls: c.type === "dir" ? ("ok" as const) : undefined,
        }))
      );
    }
  }

  function runTree(node: FsNode, prefix = "", depth = 0) {
    if (depth > 2) return;
    const kids = (node.children || []).filter((c) => !c.name.startsWith("."));
    kids.forEach((c, i) => {
      const last = i === kids.length - 1;
      print([{ text: `${prefix}${last ? "└── " : "├── "}${c.name}${c.type === "dir" ? "/" : ""}`, cls: c.type === "dir" ? "ok" : undefined }]);
      if (c.type === "dir") runTree(c, prefix + (last ? "    " : "│   "), depth + 1);
    });
  }

  function execute(raw: string) {
    const trimmed = raw.trim();
    print([{ text: `${promptStr()} ${raw}`, cls: "cmd" }]);
    if (!trimmed) return;
    setHist((h) => [...h, trimmed]);
    setHistIdx(-1);

    const [cmd, ...args] = trimmed.split(/\s+/);
    const flags = args.filter((a) => a.startsWith("-")).join("");
    const params = args.filter((a) => !a.startsWith("-"));

    switch (cmd) {
      case "help": {
        print([{ text: "Kaveri shell — available commands", cls: "ok" }]);
        const entries = Object.entries(COMMANDS);
        for (let i = 0; i < entries.length; i += 2) {
          const a = entries[i];
          const b = entries[i + 1];
          print([
            {
              text:
                `  ${a[0].padEnd(10)} ${a[1].padEnd(40)}` + (b ? `  ${b[0].padEnd(10)} ${b[1]}` : ""),
              cls: "dim",
            },
          ]);
        }
        break;
      }
      case "clear":
        setLines([]);
        break;
      case "pwd":
        print([{ text: "/" + cwd.join("/") }]);
        break;
      case "whoami":
        print([{ text: "kaveri" }]);
        break;
      case "hostname":
        print([{ text: "kaveri-os" }]);
        break;
      case "id":
        print([{ text: "uid=1000(kaveri) gid=1000(kaveri) groups=1000(kaveri),27(sudo-denied),100(users),998(firewall)" }]);
        break;
      case "date":
        print([{ text: new Date().toString() }]);
        break;
      case "uptime": {
        const s = Math.floor((Date.now() - born.current) / 1000);
        print([
          {
            text: ` ${new Date().toLocaleTimeString()} up ${Math.floor(s / 60)} min ${s % 60} s, 1 user (kaveri), load average: 0.42, 0.31, 0.27`,
          },
        ]);
        break;
      }
      case "uname":
        print([
          {
            text: flags.includes("a")
              ? "Kaveri kaveri-os 6.6.6-kaveri-secure #2.1-SMP x86_64 GNU/Linux"
              : "Kaveri",
          },
        ]);
        break;
      case "echo":
        print([{ text: params.join(" ").replace(/\$USER/g, "kaveri").replace(/\$HOME/g, "/home/kaveri") }]);
        break;
      case "history":
        print(hist.map((h, i) => ({ text: `  ${(i + 1).toString().padStart(3)}  ${h}`, cls: "dim" as const })));
        break;
      case "ls": {
        const node = getNode(cwd);
        if (node) listDir(node, flags);
        break;
      }
      case "cd": {
        const target = params[0] || "~";
        const resolved = resolvePath(cwd, target);
        if (!resolved) print([{ text: `bash: cd: ${target}: No such file or directory`, cls: "err" }]);
        else if (getNode(resolved)?.type !== "dir") print([{ text: `bash: cd: ${target}: Not a directory`, cls: "err" }]);
        else setCwd(resolved);
        break;
      }
      case "cat": {
        if (!params[0]) {
          print([{ text: "cat: missing operand", cls: "err" }]);
          break;
        }
        const resolved = resolvePath(cwd, params[0]);
        const node = resolved ? getNode(resolved) : null;
        if (!node) print([{ text: `cat: ${params[0]}: No such file or directory`, cls: "err" }]);
        else if (node.type === "dir") print([{ text: `cat: ${params[0]}: Is a directory`, cls: "err" }]);
        else if (node.kind === "binary") print([{ text: `cat: ${params[0]}: binary file — open it with the Files app`, cls: "warn" }]);
        else print((node.content || "").split("\n").map((t) => ({ text: t })));
        break;
      }
      case "tree": {
        const node = getNode(cwd);
        print([{ text: `${prettyPath(cwd)}`, cls: "ok" }]);
        if (node) runTree(node);
        break;
      }
      case "neofetch": {
        const s = Math.floor((Date.now() - born.current) / 1000);
        const info = [
          ["OS", "Kaveri OS 2.1 “Secure Horizon” x86_64"],
          ["Host", "Kaveri Secure Workstation"],
          ["Kernel", "6.6.6-kaveri-secure"],
          ["Uptime", `${Math.floor(s / 60)}m ${s % 60}s`],
          ["Shell", "kaveri-bash 5.2 (hardened)"],
          ["WM", "Kaveri Shell WM (drag / focus / z-order)"],
          ["Firewall", "active · 1,204 rules · 0 breaches"],
          ["CPU", "Kaveri V-Core 9 @ 4.20GHz"],
          ["Memory", "3120MiB / 16384MiB"],
          ["Author", "Vaibhav Thakur"],
        ];
        const rows = Math.max(KAVERI_ART.length, info.length);
        for (let r = 0; r < rows; r++) {
          const art = r < KAVERI_ART.length ? KAVERI_ART[r] : "";
          const inf = r < info.length ? `${info[r][0]}: ${info[r][1]}` : "";
          print([{ text: `  ${art.padEnd(KAVERI_ART[0].length + 6)}${inf}`, cls: r < KAVERI_ART.length ? "art" : "dim" }]);
        }
        print([{ text: "" }]);
        break;
      }
      case "banner":
        KAVERI_ART.forEach((a) => print([{ text: `  ${a}`, cls: "art" }]));
        print([{ text: "        — SECURE HORIZON · by Vaibhav Thakur —", cls: "dim" }]);
        break;
      case "ping":
        runPing(params[0] || "kaveri.os");
        break;
      case "nmap":
        runNmap(params[0] || "kaveri.os");
        break;
      case "ifconfig":
        print([
          { text: "wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500", cls: "ok" },
          { text: "        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255" },
          { text: "        ether ka:ve:ri:02:15:99  txqueuelen 1000  (Ethernet)" },
          { text: "        RX packets 48211  bytes 61204433 · secured by WPA3" },
          { text: "" },
          { text: "lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536", cls: "ok" },
          { text: "        inet 127.0.0.1  netmask 255.0.0.0" },
        ]);
        break;
      case "ps":
        print([
          { text: "  PID TTY          TIME CMD", cls: "ok" },
          { text: "    1 ?        00:00:04 kaveri-init (verified)" },
          { text: "  142 ?        00:00:11 kaveri-firewalld" },
          { text: "  208 ?        00:00:03 kaveri-auditd" },
          { text: "  377 ?        00:01:26 kaveri-shell-wm" },
          { text: "  512 pts/0    00:00:00 kaveri-bash" },
          { text: "  660 ?        00:00:19 kaveri-browser (sandboxed)" },
          { text: "  704 pts/0    00:00:00 ps" },
        ]);
        break;
      case "sudo":
        print([
          { text: "[sudo] password for kaveri: ********", cls: "dim" },
          { text: "kaveri is not in the sudoers file.", cls: "err" },
          { text: "This incident will be reported to Vaibhav Thakur.", cls: "warn" },
        ]);
        break;
      case "hack":
        runHack();
        break;
      case "open": {
        const valid = ["browser", "files", "monitor", "guides", "about", "terminal"];
        const target = params[0];
        if (!target || !valid.includes(target)) {
          print([{ text: `usage: open <${valid.join("|")}> [github|readme]`, cls: "warn" }]);
        } else if (target === "terminal") {
          print([{ text: "terminal: already looking at one, operator.", cls: "dim" }]);
        } else if (target === "files" && params[1] && ["github", "readme"].includes(params[1])) {
          api.openApp("files", params[1]);
          print([{ text: `launching files → ${params[1]} …`, cls: "ok" }]);
        } else {
          api.openApp(target as "browser");
          print([{ text: `launching ${target} …`, cls: "ok" }]);
        }
        break;
      }
      case "github":
        api.openApp("browser", "https://github.com/vaibhavthakur/kaveri-os");
        print([{ text: "opening github.com/vaibhavthakur/kaveri-os in Kaveri Browser …", cls: "ok" }]);
        break;
      case "exit":
        onClose();
        break;
      default:
        print([
          { text: `bash: ${cmd}: command not found`, cls: "err" },
          { text: "type `help` to list the hardened commands of Kaveri shell", cls: "dim" },
        ]);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const v = input;
      setInput("");
      if (!busy.current) execute(v);
      else print([{ text: `${promptStr()} ${v}`, cls: "cmd" }, { text: "shell busy — wait for the current job…", cls: "warn" }]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hist.length === 0) return;
      const idx = histIdx === -1 ? hist.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(hist[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const idx = histIdx + 1;
      if (idx >= hist.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(idx);
        setInput(hist[idx]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.split(/\s+/);
      if (parts.length <= 1) {
        const match = Object.keys(COMMANDS).filter((c) => c.startsWith(parts[0]));
        if (match.length === 1) setInput(match[0] + " ");
        else if (match.length > 1) print([{ text: match.join("   "), cls: "dim" }]);
      } else {
        const last = parts[parts.length - 1];
        const slash = last.lastIndexOf("/");
        const dirPart = slash >= 0 ? last.slice(0, slash + 1) : "";
        const prefix = slash >= 0 ? last.slice(slash + 1) : last;
        const base = resolvePath(cwd, dirPart || ".") || cwd;
        const node = getNode(base);
        const match = (node?.children || []).filter((c) => c.name.startsWith(prefix)).map((c) => c.name + (c.type === "dir" ? "/" : ""));
        if (match.length === 1) setInput([...parts.slice(0, -1), dirPart + match[0]].join(" "));
        else if (match.length > 1) print([{ text: match.join("   "), cls: "dim" }]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  const CLS: Record<string, string> = {
    cmd: "text-snow",
    err: "text-redx",
    ok: "text-tealx",
    warn: "text-amberx",
    dim: "text-fog",
    sys: "text-mint",
    art: "text-tealx text-glow-teal",
  };

  return (
    <div
      className="h-full w-full cursor-text overflow-hidden bg-[#05090d]/95 font-mono text-[12.5px] leading-[1.55]"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="h-full overflow-y-auto px-3.5 py-3">
        {lines.map((l, i) => (
          <div key={i} className={`whitespace-pre-wrap break-words ${CLS[l.cls || ""] || "text-[#c9e8dc]"}`}>
            {l.cls === "cmd" ? (
              <>
                <span className="font-semibold text-tealx">kaveri@kaveri-os</span>
                <span className="text-fog">:</span>
                <span className="text-bluex">{/^kaveri@kaveri-os:(.*)\$/.exec(l.text)?.[1] ?? "~"}</span>
                <span className="text-fog">$</span>
                <span className="text-snow">{l.text.slice(l.text.indexOf("$") + 1)}</span>
              </>
            ) : (
              l.text || "\u00A0"
            )}
          </div>
        ))}

        <div className="flex items-center gap-0 whitespace-pre">
          <span className="font-semibold text-tealx">kaveri@kaveri-os</span>
          <span className="text-fog">:</span>
          <span className="text-bluex">{prettyPath(cwd)}</span>
          <span className="text-fog">$&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="min-w-0 flex-1 border-none bg-transparent text-snow outline-none"
            autoFocus
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
