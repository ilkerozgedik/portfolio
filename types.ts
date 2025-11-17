import type React from "react";

export type Point = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Breakpoint = "mobile" | "tablet" | "desktop";

export type WindowState = {
  id: string;
  appId: string;
  title: string;
  position: Point;
  size: Size;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  isFocused: boolean;
};

export type AppConfig = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  defaultSize: Size;
  minSize?: Size;
};

export type WindowManagerContextType = {
  windows: WindowState[];
  openApp: (appId: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updateWindowPosition: (id: string, position: Point) => void;
  updateWindowSize: (id: string, size: Size) => void;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};
