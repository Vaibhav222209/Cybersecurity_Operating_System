<h1 align="center">🛡️ Operating System Kaveri</h1>

<p align="center">
  <b>A hardened, Linux-style secure operating system experience — rebuilt for the browser.</b><br/>
  Boot sequence · login gate · window shell · real terminal · firewall browser · file manager
</p>

<p align="center">
  <img src="https://img.shields.io/badge/build-passing-2dd4bf?style=flat-square" alt="build" />
  <img src="https://img.shields.io/badge/version-2.1%20%E2%80%9CSecure%20Horizon%E2%80%9D-fbbf24?style=flat-square" alt="version" />
  <img src="https://img.shields.io/badge/kernel-6.6.6--kaveri--secure-7dd3fc?style=flat-square" alt="kernel" />
  <img src="https://img.shields.io/badge/firewall-1%2C204%20rules%20active-2dd4bf?style=flat-square" alt="firewall" />
  <img src="https://img.shields.io/badge/threats%20blocked-0-brightgreen?style=flat-square" alt="threats" />
  <img src="https://img.shields.io/badge/license-MIT-8fa3b8?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/crafted%20by-Vaibhav%20Thakur-7cf5d4?style=flat-square" alt="author" />
</p>

<p align="center">
  <img src="public/images/wallpaper.jpg" width="88%" alt="Kaveri OS desktop — Secure Horizon wallpaper" />
</p>

---

## 🔍 What is Kaveri OS?

**Kaveri OS** is a cybersecurity project that simulates a complete secure desktop environment — entirely client-side, entirely in your browser. It boots like a machine, gates you behind a login, drops you into a Linux-style shell with a **top bar and a dock** (not a Windows taskbar), and ships five fully working applications — including a terminal with a real command engine running against a virtual filesystem.

Nothing here is a screenshot. Every window drags, every command executes, every URL gets filtered.

---

## 🚀 How to Open Kaveri OS

### Run it locally

```bash
git clone https://github.com/vaibhavthakur/kaveri-os.git
cd kaveri-os
npm install
npm run dev        # → http://localhost:5173
```

### What happens when it opens

| Phase | What you see | What the OS does |
|:---:|---|---|
| **1 · Boot** | A systemd-style log streams by — click anywhere to skip | Kernel init, LUKS2 volume check, **1,204 firewall rules** load, audit + IDS daemons start |
| **2 · Login** | The Kaveri Display Manager login gate | Wrong attempts shake and get logged by `kaveri-auditd` |
| **3 · Decrypt** | “Decrypting /home/kaveri …” | LUKS2 keyslot verification (simulated) |
| **4 · Desktop** | Wallpaper, top bar, dock, windows | A **Field Guide** window opens explaining the workflow |

### 🔑 Credentials

```text
user id  : kaveri
password : kaveri
```

---

## 🧭 The Workflow

```text
┌─────────┐   ┌──────────┐   ┌───────────────┐   ┌────────────────────────┐
│  BOOT   │ → │  LOGIN   │ → │ DESKTOP SHELL │ → │      APPLICATIONS      │
│ kernel  │   │ kaveri/* │   │ topbar · dock │   │ terminal · browser ·   │
│ secure  │   │ LUKS ok  │   │ windows · wm  │   │ files · monitor · docs │
└─────────┘   └──────────┘   └───────────────┘   └────────────────────────┘
        ▲                                                     │
        └────────── lock · log out · restart · power off ◄────┘
```

1. **Boot** — verified-boot log with firewall and encryption checks.
2. **Login** — authenticate with `kaveri` / `kaveri`; failures are audit-logged.
3. **Shell** — top bar (launcher · clock · tray · power), left dock, draggable/focusable windows with z-ordering, minimize & maximize.
4. **Apps** — every app is a sandboxed window sharing one in-memory filesystem.
5. **Session controls** — lock returns to the login gate, restart replays boot, power off halts the machine.

---

## 🖥️ Applications

| App | What it does |
|---|---|
| ⌨️ **Terminal** | Hardened `kaveri-bash` — 26 commands, tab-completion, history, async jobs |
| 🦊 **Kaveri Browser** | Firefox-style tabs & address bar; every URL passes an **egress allowlist** — blocked pages can trip a **honeypot** |
| 📁 **Files** | File manager over the virtual FS — markdown rendering, syntax highlighting, hex view for binaries |
| 📈 **System Monitor** | Live CPU/RAM/NET telemetry, process table, real-time threat feed |
| 📖 **Field Guide** | In-OS documentation: how to open, how it works, workflow, cheatsheet |

---

## ⌨️ Terminal Quick Reference

```bash
help              # every command, explained
ls -la · cd · cat # navigate the virtual filesystem
tree              # directory tree
neofetch          # system fingerprint (KAVERI ASCII art)
nmap kaveri.os    # simulated port scan
ping kaveri.os    # 4-packet latency check
ps · ifconfig · uptime · whoami · id · uname -a
github            # opens github.com/vaibhavthakur/kaveri-os in the browser
open files readme # opens the repo README in the Files app
sudo anything     # …you are not in the sudoers file
hack --target=x   # try it. the firewall is waiting.
```

---

## 📦 The Repository Ships Inside the OS

The OS contains a browsable copy of this very repository at `~/github/kaveri-os` —

- open it in **Files** (sidebar → `github / kaveri-os`),
- run `` `github` `` in the terminal,
- or visit `github.com/vaibhavthakur/kaveri-os` in the **Kaveri Browser** (GitHub-style page: file table, commit bar, releases, languages, rendered README).

Includes `README.md`, `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, `install.sh`, `src/kernel.ts`, `src/firewall.ts` and `.github/workflows/ci.yml`.

---

## 🏗️ Architecture

```text
kaveri-os/
├─ src/
│  ├─ App.tsx              # boot → login → desktop → halted state machine
│  ├─ system/
│  │  ├─ fs.ts             # virtual filesystem + path resolution
│  │  ├─ markdown.tsx      # markdown → aesthetic renderer
│  │  └─ types.ts          # window/app/api contracts
│  ├─ components/
│  │  ├─ Desktop.tsx       # window manager · toasts · context menu
│  │  ├─ Window.tsx        # drag · focus · z-order · maximize
│  │  ├─ TopBar.tsx        # launcher · tray · quick settings · power
│  │  └─ Dock.tsx          # left-side app dock
│  ├─ apps/
│  │  ├─ Terminal.tsx      # command engine (26 commands)
│  │  ├─ Browser.tsx       # tabs · nav · firewall routing
│  │  ├─ browserPages.tsx  # home · github · search · blocked · honeypot
│  │  ├─ Files.tsx         # file manager + viewer
│  │  ├─ Monitor.tsx       # telemetry + threat feed
│  │  ├─ Guides.tsx        # in-OS documentation
│  │  └─ About.tsx
│  └─ screens/
│     ├─ BootScreen.tsx    # secure boot log
│     └─ LoginScreen.tsx   # login gate (kaveri / kaveri)
└─ public/images/wallpaper.jpg
```

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · hand-drawn SVG iconography · Chakra Petch / IBM Plex Sans / JetBrains Mono type system.

---

## 🔒 Security Model (simulated, client-side)

- ✅ Verified boot chain with logged kernel modules
- ✅ LUKS2 home-directory encryption flow
- ✅ Egress firewall with a domain allowlist (`github.com`, `kaveri.os`, `docs.kaveri.os`)
- ✅ Honeypot sandbox for forced connections
- ✅ Audit daemon logging failed authentication attempts
- ✅ Sandboxed process table — **no data ever leaves your browser**

---

## 👨‍💻 Author

> **Operating System Kaveri** is a cybersecurity project designed, engineered and crafted by **Vaibhav Thakur**.

---

## 📄 License

Released under the [MIT License](https://github.com/vaibhavthakur/kaveri-os/blob/main/LICENSE) — see the in-OS `LICENSE` file at `~/github/kaveri-os/LICENSE`.

<p align="center"><sub>Kaveri OS v2.1 “Secure Horizon” · hardened by design · nothing leaves the sandbox</sub></p>
