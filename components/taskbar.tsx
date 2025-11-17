import { LayoutGrid } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { APPS } from "../constants";

import { useContextMenu } from "../contexts/context-menu-context";
import { useWindowManager } from "../hooks/use-window-management";
import Clock from "./clock";
import StartMenu from "./start-menu";

const Taskbar: React.FC = () => {
  const { windows, toggleMinimize, focusWindow, openApp, isMobile } =
    useWindowManager();
  const { showContextMenu } = useContextMenu();
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);
  const startMenuContainerRef = useRef<HTMLDivElement>(null);
  const taskbarRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const node = taskbarRef.current;
    if (!node) {
      return;
    }

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      showContextMenu(event.clientX, event.clientY, "taskbar");
    };

    node.addEventListener("contextmenu", handleContextMenu);
    return () => {
      node.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [showContextMenu]);

  return (
    <div
      aria-label="Taskbar - right-click for context menu"
      className={`fixed inset-x-0 bottom-0 z-50 select-none border-border/50 border-t bg-gradient-to-t from-card/95 to-card/70 shadow-lg backdrop-blur-md ${isMobile ? "h-20 pb-[env(safe-area-inset-bottom)]" : "h-16"}`}
      ref={taskbarRef}
      role="toolbar"
    >
      <div className="relative flex h-full w-full items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <div
            className={`relative ${isMobile ? "md:block" : ""}`}
            ref={startMenuContainerRef}
          >
            {isStartMenuOpen && (
              <StartMenu
                isMobile={isMobile}
                onAppClick={openApp}
                onClose={() => setStartMenuOpen(false)}
              />
            )}
            <button
              aria-expanded={isStartMenuOpen}
              aria-haspopup="true"
              className={`rounded-xl p-2 transition-all duration-200 ${isStartMenuOpen ? "bg-muted text-foreground shadow-lg" : "hover:bg-muted/30 hover:text-muted-foreground"} ${
                isMobile
                  ? "h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-primary/40 shadow-xl"
                  : ""
              }`}
              onClick={() => setStartMenuOpen((prev) => !prev)}
              type="button"
            >
              <LayoutGrid className="h-7 w-7" />
            </button>
          </div>
          <div
            className={`flex items-center gap-2 ${
              isMobile ? "scrollbar-none max-w-[60vw] overflow-x-auto" : ""
            } ${isMobile ? "flex-1" : ""}`}
          >
            {windows.map((win) => {
              const appConfig = APPS.find((app) => app.id === win.appId);
              if (!appConfig) {
                return null;
              }
              const Icon = appConfig.icon;
              const isActive = win.isFocused && !win.isMinimized;
              return (
                <button
                  className={`relative flex items-center gap-2 rounded-xl ${isMobile ? "px-3 py-2" : "px-3 py-2"} text-sm transition-all duration-200 ${
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
                  <Icon className="h-5 w-5" />
                  {!isMobile && <span className="text-sm">{win.title}</span>}
                  <div
                    className={`-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-1/2 rounded-full transition-all duration-200 ${isActive ? "bg-muted-foreground shadow-sm" : "bg-transparent"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center">
          <Clock
            className={`rounded-full px-3 py-1 text-muted-foreground text-sm ${isMobile ? "bg-muted/40" : ""}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
