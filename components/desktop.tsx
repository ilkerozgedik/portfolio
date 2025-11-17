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
  const wallpaperUrl = "https://picsum.photos/seed/wallpaper/1920/1080";

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
      className="relative h-full w-full flex-grow select-none overflow-hidden"
      role="application"
      style={{
        backgroundImage: `url(${wallpaperUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      tabIndex={-1}
    >
      <div className="absolute top-0 left-0 flex flex-col gap-2 p-4">
        {desktopAppConfigs.map((app) => (
          <DesktopIcon
            icon={app.icon}
            key={app.id}
            label={app.title}
            onClick={() => openApp(app.id)}
          />
        ))}
      </div>

      {windows.map((window) => (
        <Window key={window.id} windowState={window} />
      ))}
    </main>
  );
};

export default Desktop;
