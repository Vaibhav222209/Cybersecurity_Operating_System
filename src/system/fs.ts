// ─── Kaveri OS virtual filesystem ──────────────────────────────────────────

export type FileKind = "md" | "code" | "text" | "binary" | "key" | "conf";

export interface FsNode {
  name: string;
  type: "dir" | "file";
  kind?: FileKind;
  lang?: string;
  size?: string;
  modified?: string;
  content?: string;
  children?: FsNode[];
}

export const README_MD = `# Operating System Kaveri

@@badges Build=passing=teal,Version=2.1 “Secure Horizon”=amber,License=MIT=fog,Kernel=6.6.6-hardened=blue,Threats Blocked=0=teal

> A hardened, Linux-style secure operating system experience — rebuilt for the browser.
> Designed, engineered and crafted by **Vaibhav Thakur**.

Kaveri OS simulates a complete secure desktop environment: a boot sequence with
verified-boot logging, an encrypted login gate, a window-managed desktop shell,
a working terminal with a real command engine, a Firefox-style browser with a
built-in firewall, and a file manager browsing this very repository.

---

## How to Open Kaveri OS

1. **Boot** — On load, the machine runs its secure-boot sequence: kernel init,
   LUKS disk-encryption check, firewall ruleset loading and the intrusion
   detection daemon. Watch the log, or click anywhere to skip.
2. **Authenticate** — The Kaveri Display Manager presents the login gate.
   Enter the authorized credentials:
   - user id : \`kaveri\`
   - password : \`kaveri\`
   Wrong attempts are shaken off and logged by the audit daemon.
3. **Decrypt & Enter** — Your home directory is decrypted and the desktop shell
   loads: wallpaper, top bar, dock and a Welcome window explaining the workflow.

## The Workflow

\`\`\`
┌─────────┐   ┌──────────┐   ┌───────────────┐   ┌────────────────────────┐
│  BOOT   │ → │  LOGIN   │ → │ DESKTOP SHELL │ → │      APPLICATIONS      │
│ kernel  │   │ kaveri/* │   │ topbar · dock │   │ terminal · browser ·   │
│ secure  │   │ LUKS ok  │   │ windows · wm  │   │ files · monitor · docs │
└─────────┘   └──────────┘   └───────────────┘   └────────────────────────┘
        ▲                                                     │
        └────────── lock · log out · restart · power off ◄────┘
\`\`\`

1. Every app lives in a **draggable, focusable window** managed by the shell.
2. The **terminal** executes against a real virtual filesystem (\`ls\`, \`cd\`,
   \`cat\`, \`nmap\`, \`neofetch\` … type \`help\`).
3. The **browser** routes every address through the Kaveri Firewall — only
   allowlisted destinations (like this GitHub repo) resolve; the rest are
   blocked and can be inspected.
4. The **file manager** opens documents, renders this README, and highlights
   source code of the repo.
5. Session controls (top-bar menu) let you **lock, log out, restart or halt**
   the machine — each replays the correct phase of the workflow.

## Applications

| App | Purpose |
|---|---|
| Terminal | Hardened shell · 20+ commands · tab-completion · history |
| Kaveri Browser | Firefox-style browser · firewall filtering · GitHub client |
| Files | File manager · markdown rendering · code highlighting |
| System Monitor | Live CPU/RAM telemetry · process table · threat feed |
| Field Guide | How-to-open steps, workflow and terminal cheatsheet |

## Terminal Quick Reference

\`\`\`bash
help          list all commands          neofetch      system fingerprint
ls -la        list directory             cat <file>    print file
cd <dir>      change directory           tree          directory tree
nmap kaveri.os  simulated port scan      ping <host>   latency check
whoami        current user               ps            process table
sudo <cmd>    try it…                    hack --all    try it…
github        open this repo             open <app>    launch an app
\`\`\`

## Architecture

\`\`\`
kaveri-os/
├─ src/
│  ├─ kernel.ts      # boot + session state machine
│  ├─ firewall.ts    # URL allowlist + threat interception
│  ├─ wm/            # window manager (drag, focus, z-order)
│  └─ apps/          # terminal · browser · files · monitor · guides
├─ .github/workflows/ci.yml
└─ install.sh
\`\`\`

## Security Model

- Verified boot chain with logged kernel modules
- LUKS2 home-directory encryption (simulated)
- Egress firewall with domain allowlist + honeypot
- Audit daemon recording failed authentication attempts
- Sandboxed process table — nothing leaves your browser

---

**Crafted by Vaibhav Thakur** — cybersecurity project, Kaveri OS v2.1 “Secure Horizon”.
`;

export const FS: FsNode = {
  name: "/",
  type: "dir",
  children: [
    {
      name: "home",
      type: "dir",
      modified: "2026-01-12",
      children: [
        {
          name: "kaveri",
          type: "dir",
          modified: "2026-02-01",
          children: [
            {
              name: "Desktop",
              type: "dir",
              modified: "2026-02-01",
              children: [
                {
                  name: "workflow-notes.md",
                  type: "file",
                  kind: "md",
                  size: "1.2 KB",
                  modified: "2026-01-30",
                  content: `# Workflow Notes

Quick reminder of how Kaveri OS opens and runs:

- **Boot** → secure kernel log, firewall ruleset loads
- **Login** → \`kaveri\` / \`kaveri\` at the display manager
- **Shell** → top bar, dock, window manager come alive
- **Apps** → terminal, browser, files, monitor, guide

> If lost, open the **Field Guide** app or run \`help\` in the terminal.
`,
                },
              ],
            },
            {
              name: "Documents",
              type: "dir",
              modified: "2026-01-28",
              children: [
                {
                  name: "security-audit.md",
                  type: "file",
                  kind: "md",
                  size: "2.4 KB",
                  modified: "2026-01-28",
                  content: `# Security Audit — Kaveri OS 2.1

@@badges Status=CLEAR=teal,Auditor=V. Thakur=amber

## Summary

| Check | Result |
|---|---|
| Boot chain verification | PASS |
| Disk encryption (LUKS2) | PASS |
| Firewall allowlist | 1,204 rules active |
| Failed logins (session) | 0 |
| Open ports (nmap) | 3 · all guarded |

## Findings

1. Egress filtering correctly blocks non-allowlisted domains.
2. Honeypot engages when a blocked destination is forced.
3. Audit daemon logs every failed authentication attempt.

> No critical issues. Signed — **Vaibhav Thakur**, lead auditor.
`,
                },
                {
                  name: "recovery-codes.txt",
                  type: "file",
                  kind: "text",
                  size: "412 B",
                  modified: "2026-01-14",
                  content: `KAVERI RECOVERY VAULT — AES-256-GCM sealed
──────────────────────────────────────────
9f3a:77c1:0b2e:d4a9:88f0:31cd:5e6b:a214
c8d2:19fa:60bb:e735:4ac9:02dd:f178:93e6
51be:a4c0:7d29:38f6:cb17:e902:64ad:05ff

Do not store unsealed. — Kaveri Security Daemon
`,
                },
              ],
            },
            {
              name: "Downloads",
              type: "dir",
              modified: "2026-01-20",
              children: [
                {
                  name: "kaveri-os-2.1-secure.iso",
                  type: "file",
                  kind: "binary",
                  size: "4.2 GB",
                  modified: "2026-01-20",
                  content: "",
                },
                {
                  name: "threat-intel-feed.json",
                  type: "file",
                  kind: "code",
                  lang: "json",
                  size: "3.1 KB",
                  modified: "2026-01-19",
                  content: `{
  "feed": "kaveri-threat-intel",
  "version": "2.1.0",
  "indicators": [
    { "type": "domain", "value": "ads.malware.net", "action": "block" },
    { "type": "domain", "value": "phish-login.xyz", "action": "honeypot" },
    { "type": "ip", "value": "185.220.101.44", "action": "block" },
    { "type": "hash", "value": "e3b0c44298fc1c14", "action": "quarantine" }
  ]
}
`,
                },
              ],
            },
            {
              name: "github",
              type: "dir",
              modified: "2026-02-01",
              children: [
                {
                  name: "kaveri-os",
                  type: "dir",
                  modified: "2026-02-01",
                  children: [
                    {
                      name: ".github",
                      type: "dir",
                      modified: "2026-01-25",
                      children: [
                        {
                          name: "workflows",
                          type: "dir",
                          modified: "2026-01-25",
                          children: [
                            {
                              name: "ci.yml",
                              type: "file",
                              kind: "code",
                              lang: "yaml",
                              size: "862 B",
                              modified: "2026-01-25",
                              content: `name: Kaveri CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  secure-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install
        run: npm ci
      - name: Audit dependencies
        run: npm audit --audit-level=high
      - name: Build hardened bundle
        run: npm run build
      - name: Sign release
        run: ./scripts/sign.sh --key \${{ secrets.KAVERI_KEY }}
`,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "src",
                      type: "dir",
                      modified: "2026-02-01",
                      children: [
                        {
                          name: "kernel.ts",
                          type: "file",
                          kind: "code",
                          lang: "ts",
                          size: "1.8 KB",
                          modified: "2026-02-01",
                          content: `// Kaveri OS — session kernel
export type Phase = "boot" | "login" | "desktop" | "halted";

export function verifyBootChain(modules: string[]): boolean {
  // every module must carry a valid signature
  return modules.every((m) => signatureOf(m).verified);
}

export function nextPhase(phase: Phase, ok: boolean): Phase {
  if (phase === "boot" && ok) return "login";
  if (phase === "login" && ok) return "desktop";
  return "halted";
}

export const AUTHOR = "Vaibhav Thakur";
`,
                        },
                        {
                          name: "firewall.ts",
                          type: "file",
                          kind: "code",
                          lang: "ts",
                          size: "1.4 KB",
                          modified: "2026-01-29",
                          content: `// Kaveri Firewall — egress allowlist + honeypot
const ALLOWLIST = [
  "github.com",
  "kaveri.os",
  "docs.kaveri.os",
];

export function route(url: string): "allow" | "block" {
  const host = new URL(url).hostname.replace(/^www\\./, "");
  return ALLOWLIST.some((d) => host === d || host.endsWith("." + d))
    ? "allow"
    : "block";
}

export function honeypot(url: string): string {
  return \`connection to \${url} contained in sandbox — bait token issued\`;
}
`,
                        },
                      ],
                    },
                    {
                      name: "README.md",
                      type: "file",
                      kind: "md",
                      size: "6.3 KB",
                      modified: "2026-02-01",
                      content: README_MD,
                    },
                    {
                      name: "LICENSE",
                      type: "file",
                      kind: "text",
                      size: "1.1 KB",
                      modified: "2026-01-10",
                      content: `MIT License

Copyright (c) 2026 Vaibhav Thakur

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
`,
                    },
                    {
                      name: "CONTRIBUTING.md",
                      type: "file",
                      kind: "md",
                      size: "1.6 KB",
                      modified: "2026-01-15",
                      content: `# Contributing to Kaveri OS

@@badges PRs=welcome=teal,Code style=hardened=amber

1. Fork the repository and create a feature branch.
2. Keep the security model intact — no new egress routes without review.
3. Run \`npm audit\` and the full test matrix before opening a PR.
4. Sign commits; unsigned commits are rejected by CI.

Questions? Open an issue tagged \`discussion\`.
`,
                    },
                    {
                      name: "SECURITY.md",
                      type: "file",
                      kind: "md",
                      size: "980 B",
                      modified: "2026-01-16",
                      content: `# Security Policy

Report vulnerabilities privately to **vaibhav@kaveri.os**.

- Do not open public issues for security findings.
- Expect an acknowledgement within 24 hours.
- Coordinated disclosure after a fix ships.

> Kaveri OS runs fully sandboxed in your browser — no data ever leaves.
`,
                    },
                    {
                      name: "install.sh",
                      type: "file",
                      kind: "code",
                      lang: "sh",
                      size: "640 B",
                      modified: "2026-01-22",
                      content: `#!/usr/bin/env bash
set -euo pipefail

echo "▸ Installing Kaveri OS 2.1 (Secure Horizon)"
npm ci
npm run build
echo "▸ Verifying signature..."
gpg --verify dist/SHA256SUMS.sig dist/SHA256SUMS
echo "✔ Kaveri OS installed. Run 'npm start' and log in: kaveri / kaveri"
`,
                    },
                    {
                      name: "package.json",
                      type: "file",
                      kind: "code",
                      lang: "json",
                      size: "512 B",
                      modified: "2026-01-26",
                      content: `{
  "name": "kaveri-os",
  "version": "2.1.0",
  "description": "Hardened Linux-style secure OS experience for the browser",
  "author": "Vaibhav Thakur",
  "license": "MIT",
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "audit": "npm audit --audit-level=high"
  }
}
`,
                    },
                  ],
                },
              ],
            },
            {
              name: ".ssh",
              type: "dir",
              modified: "2026-01-08",
              children: [
                {
                  name: "id_ed25519.pub",
                  type: "file",
                  kind: "key",
                  size: "100 B",
                  modified: "2026-01-08",
                  content: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK4vKaveriSecureKeyMaterial000000000000000000 kaveri@kaveri-os
`,
                },
              ],
            },
            {
              name: ".bashrc",
              type: "file",
              kind: "conf",
              size: "220 B",
              modified: "2026-01-05",
              content: `# ~/.bashrc — Kaveri OS
export PS1="\\[\\e[36m\\]kaveri@kaveri-os\\[\\e[0m\\]:\\w $ "
alias ll="ls -la"
alias sec="nmap kaveri.os"
echo "Kaveri shell hardening applied."
`,
            },
            {
              name: ".config",
              type: "dir",
              modified: "2026-01-11",
              children: [
                {
                  name: "kaveri-theme.conf",
                  type: "file",
                  kind: "conf",
                  size: "180 B",
                  modified: "2026-01-11",
                  content: `[theme]
name = Secure Horizon
accent = #2dd4bf
alert = #fbbf24
wallpaper = /usr/share/kaveri/walls/horizon.jpg
scanlines = true
author = Vaibhav Thakur
`,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "etc",
      type: "dir",
      modified: "2026-01-02",
      children: [
        {
          name: "hostname",
          type: "file",
          kind: "text",
          size: "11 B",
          modified: "2026-01-02",
          content: "kaveri-os\n",
        },
        {
          name: "os-release",
          type: "file",
          kind: "conf",
          size: "220 B",
          modified: "2026-01-02",
          content: `NAME="Kaveri OS"
VERSION="2.1 (Secure Horizon)"
ID=kaveri
PRETTY_NAME="Kaveri OS 2.1 — hardened by Vaibhav Thakur"
HOME_URL="https://kaveri.os"
`,
        },
      ],
    },
  ],
};

// ─── path helpers ───────────────────────────────────────────────────────────

export const HOME = ["home", "kaveri"];

export function getNode(parts: string[]): FsNode | null {
  let node: FsNode = FS;
  if (parts.length === 0) return node;
  for (const p of parts) {
    if (!node.children) return null;
    const next = node.children.find((c) => c.name === p);
    if (!next) return null;
    node = next;
  }
  return node;
}

export function resolvePath(cwd: string[], path: string): string[] | null {
  const trimmed = path.trim();
  if (trimmed === "" || trimmed === "~") return [...HOME];
  let base: string[];
  let rest: string;
  if (trimmed.startsWith("/")) {
    base = [];
    rest = trimmed.slice(1);
  } else if (trimmed.startsWith("~/")) {
    base = [...HOME];
    rest = trimmed.slice(2);
  } else {
    base = [...cwd];
    rest = trimmed;
  }
  const out = [...base];
  for (const seg of rest.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") {
      out.pop();
      continue;
    }
    out.push(seg);
  }
  return getNode(out) ? out : null;
}

export function prettyPath(parts: string[]): string {
  if (parts.length === 0) return "/";
  const homeStr = HOME.join("/");
  const p = parts.join("/");
  if (p === homeStr) return "~";
  if (p.startsWith(homeStr + "/")) return "~/" + p.slice(homeStr.length + 1);
  return "/" + p;
}
