import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

export type ContextMenuState = {
  x: number;
  y: number;
  type: "window" | "desktop" | "taskbar";
  windowId?: string;
  onClose: () => void;
};

type ContextMenuContextType = {
  contextMenu: ContextMenuState | null;
  showContextMenu: (
    x: number,
    y: number,
    type: "window" | "desktop" | "taskbar",
    windowId?: string
  ) => void;
  hideContextMenu: () => void;
};

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(
  undefined
);

export const ContextMenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const hideContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const showContextMenu = useCallback(
    (
      x: number,
      y: number,
      type: "window" | "desktop" | "taskbar",
      windowId?: string
    ) => {
      setContextMenu({ x, y, type, windowId, onClose: hideContextMenu });
    },
    [hideContextMenu]
  );

  const value = {
    contextMenu,
    showContextMenu,
    hideContextMenu,
  };

  return (
    <ContextMenuContext.Provider value={value}>
      {children}
    </ContextMenuContext.Provider>
  );
};

export const useContextMenu = (): ContextMenuContextType => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within a ContextMenuProvider");
  }
  return context;
};
