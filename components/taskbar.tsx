import { LayoutGrid } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { APPS } from "../constants";

import { useContextMenu } from "../contexts/context-menu-context";
import { useWindowManager } from "../hooks/use-window-management";
import Clock from "./clock";
import StartMenu from "./start-menu";

const Taskbar: React.FC = () => {
  const { windows, toggleMinimize, focusWindow, openApp } = useWindowManager();
  const { showContextMenu } = useContextMenu();
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);
  const startMenuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        startMenuContainerRef.current &&
        !startMenuContainerRef.current.contains(event.target as Node)
      ) {
        setStartMenuOpen(false);
      }
    }
    if (isStartMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStartMenuOpen]);

  const handleTaskbarContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      showContextMenu(e.clientX, e.clientY, "taskbar");
    },
    [showContextMenu]
  );

  return (
    <button
      aria-label="Taskbar - right-click for context menu"
      className="fixed right-0 bottom-0 left-0 z-50 flex h-16 w-full select-none items-center justify-between border-border/50 border-t bg-gradient-to-t from-card/90 to-card/60 px-2 shadow-lg backdrop-blur-md"
      onContextMenu={handleTaskbarContextMenu}
      type="button"
    >
      <div className="flex items-center gap-2">
        <div className="relative" ref={startMenuContainerRef}>
          {isStartMenuOpen && (
            <StartMenu
              onAppClick={openApp}
              onClose={() => setStartMenuOpen(false)}
            />
          )}
          <button
            aria-expanded={isStartMenuOpen}
            aria-haspopup="true"
            className={`rounded-md p-2 transition-all duration-200 ${isStartMenuOpen ? "bg-muted text-foreground shadow-lg" : "hover:bg-muted/30 hover:text-muted-foreground"}`}
            onClick={() => setStartMenuOpen((prev) => !prev)}
            type="button"
          >
            <LayoutGrid className="h-8 w-8 text-foreground" />
          </button>
        </div>
        {windows.map((win) => {
          const appConfig = APPS.find((app) => app.id === win.appId);
          if (!appConfig) {
            return null;
          }
          const Icon = appConfig.icon;
          const isActive = win.isFocused && !win.isMinimized;
          return (
            <button
              className={`relative flex items-center gap-2 rounded-md px-3 py-2 transition-all duration-200 ${
                isActive
                  ? "bg-muted text-foreground shadow-md"
                  : "bg-accent/5 hover:bg-muted/30 hover:text-muted-foreground"
              }`}
              key={win.id}
              onClick={() => {
                if (win.isMinimized) {
                  toggleMinimize(win.id);
                } else if (win.isFocused) {
                  toggleMinimize(win.id);
                } else {
                  focusWindow(win.id);
                }
              }}
              type="button"
            >
              <Icon className="h-6 w-6" />
              <span className="text-base">{win.title}</span>
              <div
                className={`-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-1/2 rounded-full transition-all duration-200 ${isActive ? "bg-muted-foreground shadow-sm" : "bg-transparent"}`}
              />
            </button>
          );
        })}
      </div>
      <Clock />
    </button>
  );
};

export default Taskbar;
