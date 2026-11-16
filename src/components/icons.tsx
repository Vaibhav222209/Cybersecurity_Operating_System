import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (p: P) => {
  const { size = 18, ...rest } = p;
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
};

/* ─── Kaveri brand ─── */
export const KaveriShield = ({ size = 22, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...rest}>
    <path d="M16 2 28 7v9c0 8-5.4 12.6-12 14C9.4 28.6 4 24 4 16V7l12-5z" fill="rgba(45,212,191,0.08)" stroke="currentColor" strokeWidth="2" />
    <path d="M11.5 9v14M11.5 16.5 20 9.5M13 15l7.5 8.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

/* ─── app icons ─── */
export const TerminalIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.5" y="4" width="19" height="16" rx="2" />
    <path d="m6.5 9 3.5 3-3.5 3M12.5 15.5H17" />
  </svg>
);

export const BrowserIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3.6 9h16.8M3.6 15h16.8M12 3c-4.5 4.6-4.5 13.4 0 18M12 3c4.5 4.6 4.5 13.4 0 18" />
  </svg>
);

export const FlameBrowserIcon = ({ size = 18, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
    <path
      d="M12 21c4.6 0 8-3.2 8-7.6 0-3.8-2.4-6-4.2-8.4-.4 1.6-1.2 2.5-2.3 3C13 5.6 12 3.4 9.5 2c.4 2.3-.4 4-2 5.6C5.9 9.2 4 11 4 13.7 4 18 7.4 21 12 21z"
      fill="url(#kfg)"
      stroke="rgba(255,255,255,0.25)"
      strokeWidth="0.6"
    />
    <circle cx="12" cy="13.6" r="3.4" fill="#0a1017" stroke="#7cf5d4" strokeWidth="1.1" />
    <defs>
      <linearGradient id="kfg" x1="4" y1="3" x2="20" y2="21">
        <stop stopColor="#fbbf24" />
        <stop offset="0.55" stopColor="#fb923c" />
        <stop offset="1" stopColor="#e11d48" />
      </linearGradient>
    </defs>
  </svg>
);

export const FolderIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2.4h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
  </svg>
);

export const FileIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3h8l4 4v14H6V3z" />
    <path d="M14 3v4h4" />
  </svg>
);

export const MonitorIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.5" y="4" width="19" height="13" rx="2" />
    <path d="M6 11h2.4l1.6-3.4 2.2 6 1.6-2.6H18M9.5 20.5h5M12 17v3.5" />
  </svg>
);

export const GuideIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5.5C10 4 7.5 3.5 4 3.5v15c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2v-15c-3.5 0-6 .5-8 2z" />
    <path d="M12 5.5v15M7.5 8.5c1.2.1 2.2.3 3 .7M7.5 12c1.2.1 2.2.3 3 .7M16.5 8.5c-1.2.1-2.2.3-3 .7" />
  </svg>
);

export const InfoIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.6v.2" />
  </svg>
);

export const GitHubIcon = ({ size = 18, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...rest}>
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.72.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.25 10.25 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
  </svg>
);

/* ─── UI glyphs ─── */
export const WifiIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 9a14.5 14.5 0 0 1 19 0M5.5 12.5a10 10 0 0 1 13 0M8.6 16a5.5 5.5 0 0 1 6.8 0M12 19.5v.2" />
  </svg>
);

export const BatteryIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.5" y="8" width="16" height="8" rx="2" />
    <path d="M21.5 11v2M5 10.5v3M8 10.5v3M11 10.5v3" />
  </svg>
);

export const VolumeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" />
    <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);

export const LockIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2" />
  </svg>
);

export const PowerIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3v8M6.3 6.5a8 8 0 1 0 11.4 0" />
  </svg>
);

export const RestartIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 12a8 8 0 1 1-2.5-5.8M20 3.5V7h-3.5" />
  </svg>
);

export const LogoutIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8M10 12h10.5M17 8.5l3.5 3.5-3.5 3.5" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const XIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const ChevronLeft = (p: P) => (
  <svg {...base(p)}>
    <path d="m14.5 5.5-6 6.5 6 6.5" />
  </svg>
);

export const ChevronRight = (p: P) => (
  <svg {...base(p)}>
    <path d="m9.5 5.5 6 6.5-6 6.5" />
  </svg>
);

export const ReloadIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12a8 8 0 1 1 2.3 5.6M4 20.5V17h3.5" />
  </svg>
);

export const HomeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m3.5 11 8.5-7 8.5 7M6 9.5V20h12V9.5M10 20v-6h4v6" />
  </svg>
);

export const GridIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
  </svg>
);

export const ShieldCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3 20 6v6c0 5-3.4 8-8 9.5C7.4 20 4 17 4 12V6l8-3z" />
    <path d="m8.8 12 2.2 2.2 4.2-4.4" />
  </svg>
);

export const ShieldAlert = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3 20 6v6c0 5-3.4 8-8 9.5C7.4 20 4 17 4 12V6l8-3z" />
    <path d="M12 8v4.5M12 15.8v.2" />
  </svg>
);

export const CpuIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
  </svg>
);

export const TrashIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 6.5h15M9 6.5V4.8A1.3 1.3 0 0 1 10.3 3.5h3.4A1.3 1.3 0 0 1 15 4.8v1.7M6.5 6.5 7.4 20h9.2l.9-13.5M10 10.5v6M14 10.5v6" />
  </svg>
);

export const StarIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5z" />
  </svg>
);

export const ForkIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="7" cy="6" r="2.2" />
    <circle cx="17" cy="6" r="2.2" />
    <circle cx="12" cy="18" r="2.2" />
    <path d="M7 8.2V10c0 1.7 1.3 3 3 3h4c1.7 0 3-1.3 3-3V8.2M12 13v2.8" />
  </svg>
);

export const EyeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

export const BranchIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="7" cy="6" r="2.2" />
    <circle cx="7" cy="18" r="2.2" />
    <circle cx="17" cy="9" r="2.2" />
    <path d="M7 8.2v7.6M17 11.2c0 3-2.5 4.3-5 4.6-1.6.2-3 .8-3.6 1.6" />
  </svg>
);

export const CommitIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M2.5 12h6.3M15.2 12h6.3" />
  </svg>
);

export const IssueIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
  </svg>
);

export const PrIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="7" cy="6" r="2.2" />
    <circle cx="7" cy="18" r="2.2" />
    <circle cx="17" cy="18" r="2.2" />
    <path d="M7 8.2v7.6M17 15.8V14c0-3-2.5-4.3-5-4.6M14.5 6.5 17 9l2.5-2.5" />
  </svg>
);

export const ClockIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const PulseIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 12h4l2.5-6 4 12 2.5-6h6" />
  </svg>
);

export const ArrowUpRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const DotIcon = ({ size = 8, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 8 8" {...rest}>
    <circle cx="4" cy="4" r="3" fill="currentColor" />
  </svg>
);
