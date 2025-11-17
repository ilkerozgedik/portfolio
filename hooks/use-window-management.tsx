import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { APPS } from "../constants";
import type {
  Point,
  Size,
  WindowManagerContextType,
  WindowState,
} from "../types";

const WindowManagerContext = createContext<
  WindowManagerContextType | undefined
>(undefined);

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, zIndex: nextZIndex, isFocused: true }
            : { ...w, isFocused: false }
        )
      );
      setNextZIndex((prev) => prev + 1);
    },
    [nextZIndex]
  );

  const toggleMinimize = useCallback(
    (id: string) => {
      setWindows((prev) => {
        const windowToMinimize = prev.find((w) => w.id === id);
        if (!windowToMinimize) {
          return prev;
        }

        const isMinimizing = !windowToMinimize.isMinimized;

        // If we are minimizing, unfocus it.
        // If we are restoring, focus it.
        const newZIndex = isMinimizing ? windowToMinimize.zIndex : nextZIndex;
        const newFocused = !isMinimizing;

        if (newFocused) {
          setNextZIndex((p) => p + 1);
        }

        return prev.map((w) => {
          if (w.id === id) {
            return {
              ...w,
              isMinimized: isMinimizing,
              isFocused: newFocused,
              zIndex: newZIndex,
            };
          }
          // Unfocus other windows if we are restoring this one
          return newFocused ? { ...w, isFocused: false } : w;
        });
      });
    },
    [nextZIndex]
  );

  const openApp = useCallback(
    (appId: string) => {
      const existingWindow = windows.find(
        (w) => w.appId === appId && !w.isMinimized
      );
      if (existingWindow) {
        focusWindow(existingWindow.id);
        return;
      }

      const minimizedWindow = windows.find(
        (w) => w.appId === appId && w.isMinimized
      );
      if (minimizedWindow) {
        toggleMinimize(minimizedWindow.id);
        return;
      }

      const appConfig = APPS.find((app) => app.id === appId);
      if (!appConfig) {
        return;
      }

      // Ensure the window fits in the current viewport (mobile safeguard)
      const viewportWidth =
        typeof window !== "undefined"
          ? window.innerWidth
          : appConfig.defaultSize.width;
      const viewportHeight =
        typeof window !== "undefined"
          ? window.innerHeight - 48 // leave space for taskbar
          : appConfig.defaultSize.height;

      const width = Math.min(
        appConfig.defaultSize.width,
        Math.max(200, viewportWidth - 20)
      );
      const height = Math.min(
        appConfig.defaultSize.height,
        Math.max(150, viewportHeight - 20)
      );

      // Position the window ensuring it won't overflow the viewport
      const posX = Math.min(
        Math.random() * 200 + 50,
        Math.max(0, viewportWidth - width - 10)
      );
      const posY = Math.min(
        Math.random() * 200 + 50,
        Math.max(0, viewportHeight - height - 10)
      );

      const newWindow: WindowState = {
        id: `window-${Date.now()}`,
        appId: appConfig.id,
        title: appConfig.title,
        position: { x: posX, y: posY },
        size: { width, height },
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZIndex,
        isFocused: true,
      };

      setWindows((prev) => [
        ...prev.map((w) => ({ ...w, isFocused: false })),
        newWindow,
      ]);
      setNextZIndex((prev) => prev + 1);
    },
    [windows, nextZIndex, focusWindow, toggleMinimize]
  );

  const toggleMaximize = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
        )
      );
      focusWindow(id);
    },
    [focusWindow]
  );

  const updateWindowPosition = useCallback((id: string, position: Point) => {
    setWindows((prev) => {
      const windowIndex = prev.findIndex((w) => w.id === id);
      if (windowIndex === -1) {
        return prev;
      }

      const newWindows = [...prev];
      const currentWindow = newWindows[windowIndex];

      if (!currentWindow) {
        return prev;
      }

      // Only update if position actually changed
      if (
        currentWindow.position.x !== position.x ||
        currentWindow.position.y !== position.y
      ) {
        newWindows[windowIndex] = { ...currentWindow, position };
      }

      return newWindows;
    });
  }, []);

  const updateWindowSize = useCallback((id: string, size: Size) => {
    // Clamp size to fit within viewport (especially on mobile)
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : size.width;
    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight - 48 : size.height;
    const clampedWidth = Math.min(
      Math.max(size.width, 200),
      Math.max(200, viewportWidth - 20)
    );
    const clampedHeight = Math.min(
      Math.max(size.height, 150),
      Math.max(150, viewportHeight - 20)
    );

    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) {
          return w;
        }

        const minVisibleWidth = Math.min(200, clampedWidth * 0.3);
        // not used in position clamping - kept for future use

        const maxX = Math.max(0, viewportWidth - clampedWidth - 10);
        const maxY = Math.max(0, viewportHeight - clampedHeight - 10);

        const clampedX = Math.min(
          Math.max(w.position.x, -clampedWidth + minVisibleWidth),
          maxX
        );
        const clampedY = Math.min(Math.max(w.position.y, 0), maxY);

        return {
          ...w,
          size: { width: clampedWidth, height: clampedHeight },
          position: { x: clampedX, y: clampedY },
        };
      })
    );
  }, []);

  const value = {
    windows,
    openApp,
    closeWindow,
    focusWindow,
    toggleMinimize,
    toggleMaximize,
    updateWindowPosition,
    updateWindowSize,
  };

  // Ensure windows remain within viewport when the window is resized (e.g., mobile rotate)
  useEffect(() => {
    const handleResize = () => {
      setWindows((prev) =>
        prev.map((w) => {
          const viewportWidth =
            typeof window !== "undefined" ? window.innerWidth : w.size.width;
          const viewportHeight =
            typeof window !== "undefined"
              ? window.innerHeight - 48
              : w.size.height;

          const clampedWidth = Math.min(
            Math.max(w.size.width, 200),
            Math.max(200, viewportWidth - 20)
          );
          const clampedHeight = Math.min(
            Math.max(w.size.height, 150),
            Math.max(150, viewportHeight - 20)
          );

          const minVisibleWidth = Math.min(200, clampedWidth * 0.3);
          const maxX = Math.max(0, viewportWidth - clampedWidth - 10);
          const maxY = Math.max(0, viewportHeight - clampedHeight - 10);

          const clampedX = Math.min(
            Math.max(w.position.x, -clampedWidth + minVisibleWidth),
            maxX
          );
          const clampedY = Math.min(Math.max(w.position.y, 0), maxY);

          return {
            ...w,
            size: { width: clampedWidth, height: clampedHeight },
            position: { x: clampedX, y: clampedY },
          };
        })
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = (): WindowManagerContextType => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error("useWindowManager must be used within a WindowProvider");
  }
  return context;
};
