import type React from "react";
import { useEffect } from "react";
import { APPS, DESKTOP_APPS } from "../constants";
import { useContextMenu } from "../contexts/context-menu-context";
import { useWindowManager } from "../hooks/use-window-management";
import DesktopIcon from "./desktop-icon";
import Window from "./window";

const Desktop: React.FC = () => {
  const { windows, openApp } = useWindowManager();
  const { showContextMenu } = useContextMenu();
  const wallpaperUrl =
    "https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347";

  const desktopAppConfigs = APPS.filter((app) => DESKTOP_APPS.includes(app.id));

  useEffect(() => {
    const onContext = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) {
        return;
      }
      // Ignore context menu if clicked on a window or a button (icons or controls)
      if (target.closest(".window-draggable") || target.closest("button")) {
        return;
      }
      e.preventDefault();
      showContextMenu(e.clientX, e.clientY, "desktop");
    };
    document.addEventListener("contextmenu", onContext);
    return () => document.removeEventListener("contextmenu", onContext);
  }, [showContextMenu]);

  return (
    <main
      aria-label="Desktop area"
      className="relative flex-grow select-none overflow-hidden"
      role="application"
      style={{
        backgroundImage: `linear-gradient(180deg, rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.25)), url(${wallpaperUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      tabIndex={-1}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      <div className="absolute inset-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="grid min-h-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {desktopAppConfigs.map((app) => (
            <DesktopIcon
              icon={app.icon}
              key={app.id}
              label={app.title}
              onClick={() => openApp(app.id)}
            />
          ))}
        </div>
      </div>

      {windows.map((window) => (
        <Window key={window.id} windowState={window} />
      ))}
    </main>
  );
};

export default Desktop;
