import { Copy, Minus, RefreshCw, Square, X } from "lucide-react";
import type { FC, ReactNode } from "react";
import { useEffect, useRef } from "react";
import type { ContextMenuState } from "../contexts/context-menu-context";
import { useWindowManager } from "../hooks/use-window-management";

type ContextMenuProps = {
  contextMenu: ContextMenuState | null;
};

const ContextMenu: FC<ContextMenuProps> = ({ contextMenu }) => {
  const { closeWindow, toggleMinimize, toggleMaximize, windows, isMobile } =
    useWindowManager();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        contextMenu?.onClose
      ) {
        contextMenu.onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && contextMenu?.onClose) {
        contextMenu.onClose();
      }
    };

    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [contextMenu]);

  useEffect(() => {
    if (contextMenu && menuRef.current) {
      const menu = menuRef.current;

      // Set initial position immediately
      menu.style.left = `${contextMenu.x}px`;
      menu.style.top = `${contextMenu.y}px`;

      // Use requestAnimationFrame to ensure the menu is rendered and has dimensions
      const adjustPosition = () => {
        if (!menuRef.current) {
          return;
        }

        const menuRect = menuRef.current.getBoundingClientRect();
        const { adjustedX, adjustedY } = calculateAdjustedPosition(
          contextMenu.x,
          contextMenu.y,
          menuRect
        );

        // Apply the adjusted position only if it changed
        if (adjustedX !== contextMenu.x || adjustedY !== contextMenu.y) {
          menu.style.left = `${adjustedX}px`;
          menu.style.top = `${adjustedY}px`;
        }
      };

      const calculateAdjustedPosition = (
        x: number,
        y: number,
        rect: DOMRect
      ) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let adjustedX = x;
        let adjustedY = y;

        // Only adjust if menu has actual dimensions
        if (rect.width > 0 && rect.height > 0) {
          // Adjust horizontal position if menu goes off screen
          if (x + rect.width > viewportWidth) {
            adjustedX = viewportWidth - rect.width - 10;
          }

          // Adjust vertical position if menu goes off screen
          if (y + rect.height > viewportHeight) {
            adjustedY = viewportHeight - rect.height - 10;
          }

          // Ensure menu doesn't go above or to the left of viewport
          adjustedX = Math.max(10, adjustedX);
          adjustedY = Math.max(10, adjustedY);
        }

        return { adjustedX, adjustedY };
      };

      requestAnimationFrame(adjustPosition);
    }
  }, [contextMenu]);

  if (!contextMenu) {
    return null;
  }

  const handleAction = (action: () => void) => {
    action();
    if (contextMenu.onClose) {
      contextMenu.onClose();
    }
  };

  const baseItemClasses = isMobile
    ? "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-base text-card-foreground transition-all duration-200"
    : "flex w-full items-center gap-2 px-3 py-2 text-left text-card-foreground text-sm transition-all duration-200";

  const renderWindowMenu = () => {
    const windowId = contextMenu.windowId;
    if (!windowId) {
      return null;
    }

    const window = windows.find((w) => w.id === windowId);
    const isMaximized = window?.isMaximized;

    return (
      <>
        <button
          className={`${baseItemClasses} hover:bg-primary/15 hover:text-primary`}
          onClick={() => handleAction(() => toggleMinimize(windowId))}
          type="button"
        >
          <Minus size={14} />
          Küçült
        </button>

        <button
          className={`${baseItemClasses} hover:bg-primary/15 hover:text-primary`}
          onClick={() => handleAction(() => toggleMaximize(windowId))}
          type="button"
        >
          {isMaximized ? (
            <>
              <Copy size={14} />
              Geri Yükle
            </>
          ) : (
            <>
              <Square size={14} />
              Tam Ekran
            </>
          )}
        </button>

        <div className="my-1 border-border/10 border-t" />

        <button
          className={`${baseItemClasses} text-destructive-foreground hover:bg-destructive/20`}
          onClick={() => handleAction(() => closeWindow(windowId))}
          type="button"
        >
          <X size={14} />
          Kapat
        </button>
      </>
    );
  };

  const renderDesktopMenu = () => (
    <button
      className={`${baseItemClasses} hover:bg-accent/10`}
      onClick={() => handleAction(() => window.location.reload())}
      type="button"
    >
      <RefreshCw size={14} />
      Yenile
    </button>
  );

  const renderTaskbarMenu = () => (
    <button
      className={`${baseItemClasses} hover:bg-accent/10`}
      onClick={() => handleAction(() => window.location.reload())}
      type="button"
    >
      <RefreshCw size={14} />
      Yenile
    </button>
  );

  if (!contextMenu) {
    return null;
  }

  let menuContent: ReactNode;
  if (contextMenu.type === "window") {
    menuContent = renderWindowMenu();
  } else if (contextMenu.type === "taskbar") {
    menuContent = renderTaskbarMenu();
  } else {
    menuContent = renderDesktopMenu();
  }

  return (
    <div
      className={`fixed select-none border border-border/20 bg-card/95 shadow-2xl ring-1 ring-primary/10 backdrop-blur-lg ${isMobile ? "min-w-[220px] rounded-2xl p-1.5" : "min-w-[180px] rounded-lg py-1"}`}
      onContextMenu={(e) => e.preventDefault()}
      ref={menuRef}
      role="menu"
      style={{ zIndex: 9999 }}
    >
      {menuContent}
    </div>
  );
};

export default ContextMenu;
