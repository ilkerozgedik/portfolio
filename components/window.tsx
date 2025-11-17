import { Minus, Square, X } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { APPS } from "../constants";

import { useContextMenu } from "../contexts/context-menu-context";
import { useWindowManager } from "../hooks/use-window-management";
import type { Point, Size, WindowState } from "../types";

type WindowProps = {
  windowState: WindowState;
};

/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Window orchestration (drag, resize, context menus) requires several conditional branches by design. */
const Window: React.FC<WindowProps> = ({ windowState }) => {
  const {
    closeWindow,
    focusWindow,
    toggleMinimize,
    toggleMaximize,
    updateWindowPosition,
    updateWindowSize,
    isMobile,
    isTablet,
  } = useWindowManager();
  const { showContextMenu } = useContextMenu();

  const windowRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const pointerIdRef = useRef<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<string | null>(null);
  const resizeStartRef = useRef<Point>({ x: 0, y: 0 });
  const initialSizeRef = useRef<Size>({ width: 0, height: 0 });
  const initialPosRef = useRef<Point>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastPositionRef = useRef<Point>({ x: 0, y: 0 });

  const appConfig = APPS.find((app) => app.id === windowState.appId);

  const constrainX = useCallback(
    (x: number, vWidth: number, wWidth: number) => {
      const minVisibleWidth = Math.min(200, wWidth * 0.3);

      if (x < -wWidth + minVisibleWidth) {
        return -wWidth + minVisibleWidth;
      }
      if (x > vWidth - minVisibleWidth) {
        return vWidth - minVisibleWidth;
      }
      return x;
    },
    []
  );

  const constrainY = useCallback(
    (y: number, vHeight: number, wHeight: number) => {
      const minVisibleHeight = Math.min(100, wHeight * 0.3);

      if (y < 0) {
        return 0;
      }
      if (y > vHeight - minVisibleHeight) {
        return vHeight - minVisibleHeight;
      }
      return y;
    },
    []
  );

  const calculateDragPosition = useCallback(
    (e: MouseEvent, dragPosition: Point) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - 64; // 64px = 4rem (taskbar height)
      const windowWidth = windowState.size.width;
      const windowHeight = windowState.size.height;

      const rawX = e.clientX - dragPosition.x;
      const rawY = e.clientY - dragPosition.y;
      const constrainedX = constrainX(rawX, viewportWidth, windowWidth);
      const constrainedY = constrainY(rawY, viewportHeight, windowHeight);

      return { newX: constrainedX, newY: constrainedY };
    },
    [windowState.size, constrainX, constrainY]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      showContextMenu(e.clientX, e.clientY, "window", windowState.id);
    },
    [showContextMenu, windowState.id]
  );

  const onDragStart = useCallback(
    (clientX: number, clientY: number, pId?: number) => {
      focusWindow(windowState.id);
      if (windowState.isMaximized) {
        return;
      }
      setIsDragging(true);
      const offsetX = clientX - windowState.position.x;
      const offsetY = clientY - windowState.position.y;
      setDragStart({ x: offsetX, y: offsetY });
      lastPositionRef.current = {
        x: windowState.position.x,
        y: windowState.position.y,
      };
      if (typeof pId === "number") {
        pointerIdRef.current = pId;
        const el = dragHandleRef.current as Element | null;
        if (el) {
          const elAsAny = el as unknown as {
            setPointerCapture?: (id: number) => void;
            releasePointerCapture?: (id: number) => void;
          };
          if (elAsAny.setPointerCapture) {
            elAsAny.setPointerCapture(pId);
          }
        }
      }
    },
    [focusWindow, windowState.id, windowState.position, windowState.isMaximized]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (
        e.target !== dragHandleRef.current &&
        !dragHandleRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      e.preventDefault();
      onDragStart(e.clientX, e.clientY, e.pointerId);
    },
    [onDragStart]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (
        e.target !== dragHandleRef.current &&
        !dragHandleRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      e.preventDefault();
      onDragStart(e.clientX, e.clientY);
    },
    [onDragStart]
  );

  useEffect(() => {
    if (!isDragging || windowState.isMaximized) {
      return;
    }

    const handleMouseMove = (e: MouseEvent | PointerEvent) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const { newX, newY } = calculateDragPosition(e, dragStart);

        // Only update if position actually changed to avoid unnecessary re-renders
        if (
          Math.abs(newX - lastPositionRef.current.x) > 0.5 ||
          Math.abs(newY - lastPositionRef.current.y) > 0.5
        ) {
          updateWindowPosition(windowState.id, { x: newX, y: newY });
          lastPositionRef.current = { x: newX, y: newY };
        }
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Release pointer capture if we stored one on drag handle
      if (pointerIdRef.current != null && dragHandleRef.current) {
        try {
          (dragHandleRef.current as unknown as Element).releasePointerCapture(
            pointerIdRef.current
          );
        } catch {
          // ignore if API not supported
        }
        pointerIdRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    document.addEventListener("mousemove", handleMouseMove as EventListener);
    document.addEventListener("mouseup", handleMouseUp as EventListener);
    // Pointer events support for touch devices
    document.addEventListener("pointermove", handleMouseMove as EventListener);
    document.addEventListener("pointerup", handleMouseUp as EventListener);
    document.addEventListener("pointercancel", handleMouseUp as EventListener);
    document.addEventListener("touchend", handleMouseUp as EventListener);
    document.addEventListener("touchcancel", handleMouseUp as EventListener);

    return () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove as EventListener
      );
      document.removeEventListener("mouseup", handleMouseUp as EventListener);
      document.removeEventListener(
        "pointermove",
        handleMouseMove as EventListener
      );
      document.removeEventListener("pointerup", handleMouseUp as EventListener);
      document.removeEventListener(
        "pointercancel",
        handleMouseUp as EventListener
      );
      document.removeEventListener("touchend", handleMouseUp as EventListener);
      document.removeEventListener(
        "touchcancel",
        handleMouseUp as EventListener
      );
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isDragging,
    dragStart,
    updateWindowPosition,
    windowState.id,
    windowState.isMaximized,
    calculateDragPosition,
  ]);

  // ----- RESIZE HANDLING -----
  const startResize = useCallback(
    (dir: string, clientX: number, clientY: number) => {
      setIsResizing(true);
      setResizeDir(dir);
      resizeStartRef.current = { x: clientX, y: clientY };
      initialSizeRef.current = { ...windowState.size };
      initialPosRef.current = { ...windowState.position };
    },
    [windowState.size, windowState.position]
  );

  const performResize = useCallback(
    (dir: string, dx: number, dy: number) => {
      let newWidth = initialSizeRef.current.width;
      let newHeight = initialSizeRef.current.height;
      let newX = initialPosRef.current.x;
      let newY = initialPosRef.current.y;

      if (dir.includes("e")) {
        newWidth = Math.max(100, initialSizeRef.current.width + dx);
      }
      if (dir.includes("s")) {
        newHeight = Math.max(100, initialSizeRef.current.height + dy);
      }
      if (dir.includes("w")) {
        newWidth = Math.max(100, initialSizeRef.current.width - dx);
        newX = initialPosRef.current.x + dx;
      }
      if (dir.includes("n")) {
        newHeight = Math.max(100, initialSizeRef.current.height - dy);
        newY = initialPosRef.current.y + dy;
      }

      updateWindowSize(windowState.id, {
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      });
      updateWindowPosition(windowState.id, {
        x: Math.round(newX),
        y: Math.round(newY),
      });
    },
    [updateWindowPosition, updateWindowSize, windowState.id]
  );

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const handlePointerMove = (ev: PointerEvent) => {
      if (!isResizing) {
        return;
      }
      if (!resizeDir) {
        return;
      }
      const dx = ev.clientX - resizeStartRef.current.x;
      const dy = ev.clientY - resizeStartRef.current.y;
      performResize(resizeDir, dx, dy);
    };

    const handlePointerUp = () => {
      setIsResizing(false);
      setResizeDir(null);
      if (pointerIdRef.current != null && windowRef.current) {
        try {
          (windowRef.current as Element).releasePointerCapture(
            pointerIdRef.current
          );
        } catch {
          // ignore
        }
        pointerIdRef.current = null;
      }
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerUp);
    document.addEventListener("mouseup", handlePointerUp);
    document.addEventListener("touchend", handlePointerUp);
    document.addEventListener("touchcancel", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
      document.removeEventListener("mouseup", handlePointerUp);
      document.removeEventListener("touchend", handlePointerUp);
      document.removeEventListener("touchcancel", handlePointerUp);
    };
  }, [isResizing, resizeDir, performResize]);

  if (windowState.isMinimized) {
    return null;
  }

  const taskbarOffset = isMobile
    ? "calc(100dvh - 4.5rem)"
    : "calc(100dvh - 4rem)";
  const canDrag = !(isMobile || windowState.isMaximized);
  const canResize = !(isMobile || windowState.isMaximized);
  const headerLayout = isMobile
    ? "flex flex-col gap-1 py-2"
    : "flex h-10 items-center justify-between";
  let contentPadding = "p-6";
  if (isTablet) {
    contentPadding = "p-5";
  }
  if (isMobile) {
    contentPadding = "p-4";
  }

  const windowClasses = [
    "absolute flex flex-col bg-card/90 backdrop-blur-lg shadow-2xl shadow-black/40 border border-border/20 select-none",
    canDrag ? "window-draggable" : "",
    isMobile ? "rounded-none" : "rounded-lg",
    isDragging ? "transition-none" : "transition-all duration-200 ease-in-out",
    windowState.isMaximized ? "top-0 left-0 w-full" : "",
    windowState.isFocused
      ? "border-primary/30 ring-1 ring-primary/20"
      : "border-border/20",
  ]
    .filter(Boolean)
    .join(" ");

  const windowStyle: React.CSSProperties = windowState.isMaximized
    ? {
        left: 0,
        top: 0,
        width: "100%",
        height: taskbarOffset,
        zIndex: windowState.zIndex,
      }
    : {
        left: `${windowState.position.x}px`,
        top: `${windowState.position.y}px`,
        width: `${windowState.size.width}px`,
        height: `${windowState.size.height}px`,
        zIndex: windowState.zIndex,
        maxWidth: "calc(100vw - 10px)",
        maxHeight: "calc(100vh - 4rem - 10px)",
        minWidth: 200,
        minHeight: 150,
      };

  const AppIcon = appConfig?.icon;
  const AppComponent = appConfig?.component;

  return (
    <div className={windowClasses} ref={windowRef} style={windowStyle}>
      {/* Resize handles: NW, NE, SE, SW */}
      {canResize && (
        <>
          <button
            aria-label="Resize NW"
            className="absolute"
            onMouseDown={(e) => startResize("nw", e.clientX, e.clientY)}
            onPointerDown={(e) => {
              const pId = e.pointerId;
              pointerIdRef.current = pId;
              if (
                typeof (windowRef.current as Element)?.setPointerCapture ===
                "function"
              ) {
                (windowRef.current as Element).setPointerCapture(pId);
              }
              startResize("nw", e.clientX, e.clientY);
            }}
            style={{
              left: 0,
              top: 0,
              transform: "translate(-50%, -50%)",
              width: 16,
              height: 16,
              cursor: "nwse-resize",
              background: "transparent",
              zIndex: 50,
            }}
            type="button"
          />
          <button
            aria-label="Resize NE"
            className="absolute"
            onMouseDown={(e) => startResize("ne", e.clientX, e.clientY)}
            onPointerDown={(e) => {
              const pId = e.pointerId;
              pointerIdRef.current = pId;
              if (
                typeof (windowRef.current as Element)?.setPointerCapture ===
                "function"
              ) {
                (windowRef.current as Element).setPointerCapture(pId);
              }
              startResize("ne", e.clientX, e.clientY);
            }}
            style={{
              right: 0,
              top: 0,
              transform: "translate(50%, -50%)",
              width: 16,
              height: 16,
              cursor: "nesw-resize",
              background: "transparent",
              zIndex: 50,
            }}
            type="button"
          />
          <button
            aria-label="Resize SE"
            className="absolute"
            onMouseDown={(e) => startResize("se", e.clientX, e.clientY)}
            onPointerDown={(e) => {
              const pId = e.pointerId;
              pointerIdRef.current = pId;
              if (
                typeof (windowRef.current as Element)?.setPointerCapture ===
                "function"
              ) {
                (windowRef.current as Element).setPointerCapture(pId);
              }
              startResize("se", e.clientX, e.clientY);
            }}
            style={{
              right: 0,
              bottom: 0,
              transform: "translate(50%, 50%)",
              width: 16,
              height: 16,
              cursor: "nwse-resize",
              background: "transparent",
              zIndex: 50,
            }}
            type="button"
          />
          <button
            aria-label="Resize SW"
            className="absolute"
            onMouseDown={(e) => startResize("sw", e.clientX, e.clientY)}
            onPointerDown={(e) => {
              const pId = e.pointerId;
              pointerIdRef.current = pId;
              if (
                typeof (windowRef.current as Element)?.setPointerCapture ===
                "function"
              ) {
                (windowRef.current as Element).setPointerCapture(pId);
              }
              startResize("sw", e.clientX, e.clientY);
            }}
            style={{
              left: 0,
              bottom: 0,
              transform: "translate(-50%, 50%)",
              width: 16,
              height: 16,
              cursor: "nesw-resize",
              background: "transparent",
              zIndex: 50,
            }}
            type="button"
          />
        </>
      )}
      <header className={`${headerLayout} bg-muted/20 px-3`}>
        <button
          aria-label="Window title bar - drag to move"
          className={`${canDrag ? "drag-handle" : ""} flex flex-1 items-center gap-2 ${canDrag ? "h-full py-0" : "py-1"} ${isMobile ? "justify-between" : "pl-2"}`}
          onContextMenu={handleContextMenu}
          onDoubleClick={() => !isMobile && toggleMaximize(windowState.id)}
          onMouseDown={(e) => (canDrag ? handleMouseDown(e) : undefined)}
          onPointerDown={(e) => (canDrag ? handlePointerDown(e) : undefined)}
          ref={dragHandleRef}
          type="button"
        >
          <div className="flex flex-1 items-center gap-2">
            {AppIcon && (
              <AppIcon
                className={`text-muted-foreground ${isMobile ? "h-5 w-5" : "h-5 w-5"}`}
              />
            )}
            <span
              className={`font-medium text-card-foreground ${isMobile ? "text-base" : "text-base"}`}
            >
              {windowState.title}
            </span>
          </div>
        </button>
        <div
          className={`flex items-center gap-1 ${isMobile ? "justify-end pt-1" : ""}`}
        >
          <button
            aria-label="Minimize window"
            className="rounded p-1 transition-colors duration-200 hover:bg-muted/30 hover:text-muted-foreground"
            onClick={() => toggleMinimize(windowState.id)}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            type="button"
          >
            <Minus size={16} />
          </button>
          {!isMobile && (
            <button
              aria-label="Maximize window"
              className="rounded p-1 transition-colors duration-200 hover:bg-muted/30 hover:text-muted-foreground"
              onClick={() => toggleMaximize(windowState.id)}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              type="button"
            >
              <Square size={16} />
            </button>
          )}
          <button
            aria-label="Close window"
            className="rounded p-1 transition-colors duration-200 hover:bg-destructive/15 hover:text-destructive-foreground"
            onClick={() => closeWindow(windowState.id)}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      </header>
      <div className={`flex-grow overflow-auto ${contentPadding}`}>
        {AppComponent && <AppComponent />}
      </div>
    </div>
  );
};

export default Window;
