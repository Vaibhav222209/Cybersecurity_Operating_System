import type { ComponentType } from "react";

export type AppId = "terminal" | "browser" | "files" | "monitor" | "guides" | "about";

export interface WindowData {
  id: number;
  app: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

export type NotifyKind = "info" | "success" | "warn" | "danger";

export interface OsApi {
  openApp: (id: AppId, payload?: string) => void;
  closeApp: (id: AppId) => void;
  notify: (title: string, body?: string, kind?: NotifyKind) => void;
  logout: () => void;
}

export interface AppProps {
  api: OsApi;
  payload?: string;
  onClose: () => void;
}

export interface AppDef {
  id: AppId;
  name: string;
  tagline: string;
  component: ComponentType<AppProps>;
  w: number;
  h: number;
  accent: string;
}
