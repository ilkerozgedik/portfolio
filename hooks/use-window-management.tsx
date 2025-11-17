import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { APPS } from "../constants";
import {
  clampWindowPlacement,
  TASKBAR_HEIGHT,
  WINDOW_EDGE_GAP,
  WINDOW_MIN_HEIGHT,
  WINDOW_MIN_WIDTH,
} from "../lib/window-layout";
import type {
  Point,
  Size,
  WindowManagerContextType,
  WindowState,
} from "../types";
import { useBreakpoint } from "./use-breakpoint";

const WindowManagerContext = createContext<
  WindowManagerContextType | undefined
>(undefined);

const getViewportBounds = (fallbackSize: Size): Size => {
  if (typeof window === "undefined") {
    return fallbackSize;
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight - TASKBAR_HEIGHT,
  };
};

const computeMaximizedWindow = (
  windowState: WindowState,
  viewport: { width: number; height: number },
  forceMaximize: boolean
): WindowState => {
  const nextState = forceMaximize ? true : !windowState.isMaximized;
  return {
    ...windowState,
    isMaximized: nextState,
    position: nextState ? { x: 0, y: 0 } : windowState.position,
    size: nextState
      ? { width: viewport.width, height: viewport.height }
      : windowState.size,
  };
};

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();

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

  const computeViewport = useCallback(() => {
    if (typeof window === "undefined") {
      return {
        width: 1024,
        height: 768 - TASKBAR_HEIGHT,
      };
    }

    const mobilePadding = isMobile ? 12 : 20;
    const taskbarOffset = TASKBAR_HEIGHT + (isMobile ? 8 : 0);

    return {
      width: window.innerWidth - mobilePadding,
      height: window.innerHeight - taskbarOffset,
    };
  }, [isMobile]);

  const openApp = useCallback(
    (appId: string) => {
      const targetWindow = windows.find((w) => w.appId === appId);
      if (targetWindow) {
        if (targetWindow.isMinimized) {
          toggleMinimize(targetWindow.id);
        } else {
          focusWindow(targetWindow.id);
        }
        return;
      }

      const appConfig = APPS.find((app) => app.id === appId);
      if (!appConfig) {
        return;
      }

      const viewport = computeViewport();
      const minWidth = appConfig.minSize?.width ?? WINDOW_MIN_WIDTH;
      const minHeight = appConfig.minSize?.height ?? WINDOW_MIN_HEIGHT;

      const width = isMobile
        ? viewport.width
        : Math.min(
            appConfig.defaultSize.width,
            Math.max(minWidth, viewport.width - WINDOW_EDGE_GAP)
          );
      const height = isMobile
        ? viewport.height
        : Math.min(
            appConfig.defaultSize.height,
            Math.max(minHeight, viewport.height - WINDOW_EDGE_GAP)
          );

      const shouldMaximize = isMobile;

      // Position the window ensuring it won't overflow the viewport
      const posX = shouldMaximize
        ? 0
        : Math.min(
            Math.random() * 200 + 50,
            Math.max(0, viewport.width - width - WINDOW_EDGE_GAP / 2)
          );
      const posY = shouldMaximize
        ? 0
        : Math.min(
            Math.random() * 200 + 50,
            Math.max(0, viewport.height - height - WINDOW_EDGE_GAP / 2)
          );

      const newWindow: WindowState = {
        id: `window-${Date.now()}`,
        appId: appConfig.id,
        title: appConfig.title,
        position: { x: posX, y: posY },
        size: { width, height },
        isMinimized: false,
        isMaximized: shouldMaximize,
        zIndex: nextZIndex,
        isFocused: true,
      };

      setWindows((prev) => [
        ...prev.map((w) => ({ ...w, isFocused: false })),
        newWindow,
      ]);
      setNextZIndex((prev) => prev + 1);
    },
    [
      windows,
      nextZIndex,
      focusWindow,
      toggleMinimize,
      computeViewport,
      isMobile,
    ]
  );

  const updateWindowPosition = useCallback(
    (id: string, position: Point) => {
      if (isMobile) {
        return;
      }

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
    },
    [isMobile]
  );

  const updateWindowSize = useCallback(
    (id: string, size: Size) => {
      if (isMobile) {
        return;
      }

      const viewport = getViewportBounds(size);
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== id) {
            return w;
          }
          const { size: nextSize, position: nextPosition } =
            clampWindowPlacement({
              size,
              position: w.position,
              viewport,
            });

          return {
            ...w,
            size: nextSize,
            position: nextPosition,
          };
        })
      );
    },
    [isMobile]
  );

  // Ensure windows remain within viewport when the window is resized (e.g., mobile rotate)
  useEffect(() => {
    const handleResize = () => {
      setWindows((prev) =>
        prev.map((w) => {
          const viewport = computeViewport();
          const shouldMaximize = isMobile;

          if (shouldMaximize) {
            return {
              ...w,
              isMaximized: true,
              position: { x: 0, y: 0 },
              size: {
                width: viewport.width,
                height: viewport.height,
              },
            };
          }

          const viewportBounds = getViewportBounds(w.size);
          const { size, position } = clampWindowPlacement({
            size: w.size,
            position: w.position,
            viewport: viewportBounds,
          });

          return {
            ...w,
            size,
            position,
          };
        })
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [computeViewport, isMobile]);

  const handleToggleMaximize = useCallback(
    (id: string) => {
      const viewport = computeViewport();
      const forceMaximize = isMobile;

      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? computeMaximizedWindow(w, viewport, forceMaximize) : w
        )
      );
      focusWindow(id);
    },
    [computeViewport, focusWindow, isMobile]
  );

  const value: WindowManagerContextType = {
    windows,
    openApp,
    closeWindow,
    focusWindow,
    toggleMinimize,
    toggleMaximize: handleToggleMaximize,
    updateWindowPosition,
    updateWindowSize,
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
  };

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
