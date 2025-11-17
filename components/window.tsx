import { Minus, Square, X } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { APPS } from "../constants";

import { useContextMenu } from "../contexts/context-menu-context";
import { useWindowManager } from "../hooks/use-window-management";
import { TASKBAR_HEIGHT } from "../lib/window-layout";
import type { Point, Size, WindowState } from "../types";

type WindowProps = {
  windowState: WindowState;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const useWindowDrag = ({
  windowState,
  focusWindow,
  updateWindowPosition,
  showContextMenu,
}: {
  windowState: WindowState;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: Point) => void;
  showContextMenu: (
    x: number,
    y: number,
    type: "window" | "desktop" | "taskbar",
    windowId?: string
  ) => void;
}) => {
  const dragHandleRef = useRef<HTMLButtonElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastPositionRef = useRef<Point>({
    x: windowState.position.x,
    y: windowState.position.y,
  });

  const calculatePosition = useCallback(
    (event: MouseEvent | PointerEvent, start: Point) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - TASKBAR_HEIGHT;
      const windowWidth = windowState.size.width;
      const windowHeight = windowState.size.height;
      const minVisibleWidth = Math.min(200, windowWidth * 0.3);
      const minVisibleHeight = Math.min(100, windowHeight * 0.3);

      const rawX = event.clientX - start.x;
      const rawY = event.clientY - start.y;

      const x = clamp(
        rawX,
        -windowWidth + minVisibleWidth,
        viewportWidth - minVisibleWidth
      );
      const y = clamp(rawY, 0, viewportHeight - minVisibleHeight);

      return { x, y };
    },
    [windowState.size.height, windowState.size.width]
  );

  const startDrag = useCallback(
    (clientX: number, clientY: number, pointerId?: number) => {
      focusWindow(windowState.id);
      if (windowState.isMaximized) {
        return;
      }
      setIsDragging(true);
      setDragStart({
        x: clientX - windowState.position.x,
        y: clientY - windowState.position.y,
      });
      lastPositionRef.current = {
        x: windowState.position.x,
        y: windowState.position.y,
      };
      if (typeof pointerId === "number") {
        pointerIdRef.current = pointerId;
        dragHandleRef.current?.setPointerCapture?.(pointerId);
      }
    },
    [
      focusWindow,
      windowState.id,
      windowState.isMaximized,
      windowState.position.x,
      windowState.position.y,
    ]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (
        event.target !== dragHandleRef.current &&
        !dragHandleRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      event.preventDefault();
      startDrag(event.clientX, event.clientY, event.pointerId);
    },
    [startDrag]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (
        event.target !== dragHandleRef.current &&
        !dragHandleRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      event.preventDefault();
      startDrag(event.clientX, event.clientY);
    },
    [startDrag]
  );

  useEffect(() => {
    if (!isDragging || windowState.isMaximized) {
      return;
    }

    const handleMove = (event: MouseEvent | PointerEvent) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const { x, y } = calculatePosition(event, dragStart);
        if (
          Math.abs(x - lastPositionRef.current.x) > 0.5 ||
          Math.abs(y - lastPositionRef.current.y) > 0.5
        ) {
          updateWindowPosition(windowState.id, { x, y });
          lastPositionRef.current = { x, y };
        }
      });
    };

    const stopDragging = () => {
      setIsDragging(false);
      if (pointerIdRef.current != null && dragHandleRef.current) {
        dragHandleRef.current.releasePointerCapture?.(pointerIdRef.current);
        pointerIdRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", stopDragging);
    document.addEventListener("pointercancel", stopDragging);
    document.addEventListener("touchend", stopDragging);
    document.addEventListener("touchcancel", stopDragging);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", stopDragging);
      document.removeEventListener("pointercancel", stopDragging);
      document.removeEventListener("touchend", stopDragging);
      document.removeEventListener("touchcancel", stopDragging);
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
    calculatePosition,
  ]);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      showContextMenu(event.clientX, event.clientY, "window", windowState.id);
    },
    [showContextMenu, windowState.id]
  );

  return {
    dragHandleRef,
    handleMouseDown,
    handlePointerDown,
    handleContextMenu,
    isDragging,
  };
};

const useWindowResize = ({
  windowState,
  updateWindowPosition,
  updateWindowSize,
  windowRef,
}: {
  windowState: WindowState;
  updateWindowPosition: (id: string, position: Point) => void;
  updateWindowSize: (id: string, size: Size) => void;
  windowRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<string | null>(null);
  const resizeStartRef = useRef<Point>({ x: 0, y: 0 });
  const initialSizeRef = useRef<Size>({ width: 0, height: 0 });
  const initialPosRef = useRef<Point>({ x: 0, y: 0 });
  const pointerIdRef = useRef<number | null>(null);

  const startResize = useCallback(
    (dir: string, clientX: number, clientY: number) => {
      setIsResizing(true);
      setResizeDir(dir);
      resizeStartRef.current = { x: clientX, y: clientY };
      initialSizeRef.current = { ...windowState.size };
      initialPosRef.current = { ...windowState.position };
    },
    [windowState.position, windowState.size]
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
    if (!(isResizing && resizeDir)) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!(isResizing && resizeDir)) {
        return;
      }
      const dx = event.clientX - resizeStartRef.current.x;
      const dy = event.clientY - resizeStartRef.current.y;
      performResize(resizeDir, dx, dy);
    };

    const stopResizing = () => {
      setIsResizing(false);
      setResizeDir(null);
      if (pointerIdRef.current != null && windowRef.current) {
        windowRef.current.releasePointerCapture?.(pointerIdRef.current);
        pointerIdRef.current = null;
      }
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", stopResizing);
    document.addEventListener("pointercancel", stopResizing);
    document.addEventListener("mouseup", stopResizing);
    document.addEventListener("touchend", stopResizing);
    document.addEventListener("touchcancel", stopResizing);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", stopResizing);
      document.removeEventListener("pointercancel", stopResizing);
      document.removeEventListener("mouseup", stopResizing);
      document.removeEventListener("touchend", stopResizing);
      document.removeEventListener("touchcancel", stopResizing);
    };
  }, [isResizing, resizeDir, performResize, windowRef]);

  const handleMouseDown = useCallback(
    (dir: string, event: React.MouseEvent<HTMLButtonElement>) => {
      startResize(dir, event.clientX, event.clientY);
    },
    [startResize]
  );

  const handlePointerDown = useCallback(
    (dir: string, event: React.PointerEvent<HTMLButtonElement>) => {
      pointerIdRef.current = event.pointerId;
      windowRef.current?.setPointerCapture?.(event.pointerId);
      startResize(dir, event.clientX, event.clientY);
    },
    [startResize, windowRef]
  );

  return {
    isResizing,
    handleMouseDown,
    handlePointerDown,
  };
};

const WindowResizeHandles: React.FC<{
  canResize: boolean;
  onMouseDown: (
    dir: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  onPointerDown: (
    dir: string,
    event: React.PointerEvent<HTMLButtonElement>
  ) => void;
}> = ({ canResize, onMouseDown, onPointerDown }) => {
  if (!canResize) {
    return null;
  }

  const handles = [
    { dir: "nw", style: { left: 0, top: 0 }, cursor: "nwse-resize" },
    { dir: "ne", style: { right: 0, top: 0 }, cursor: "nesw-resize" },
    { dir: "se", style: { right: 0, bottom: 0 }, cursor: "nwse-resize" },
    { dir: "sw", style: { left: 0, bottom: 0 }, cursor: "nesw-resize" },
  ] as const;

  return (
    <>
      {handles.map((handle) => (
        <button
          aria-label={`Resize ${handle.dir.toUpperCase()}`}
          className="absolute"
          key={handle.dir}
          onMouseDown={(event) => onMouseDown(handle.dir, event)}
          onPointerDown={(event) => onPointerDown(handle.dir, event)}
          style={{
            ...(handle.style as React.CSSProperties),
            transform: `translate(${handle.dir.includes("e") ? "50%" : "-50%"}, ${handle.dir.includes("s") ? "50%" : "-50%"})`,
            width: 16,
            height: 16,
            cursor: handle.cursor,
            background: "transparent",
            zIndex: 50,
          }}
          type="button"
        />
      ))}
    </>
  );
};

const WindowHeader: React.FC<{
  canDrag: boolean;
  isMobile: boolean;
  dragHandleRef: React.RefObject<HTMLButtonElement | null>;
  handleContextMenu: (event: React.MouseEvent) => void;
  handleMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handlePointerDown: (event: React.PointerEvent<HTMLButtonElement>) => void;
  toggleMaximize: (id: string) => void;
  toggleMinimize: (id: string) => void;
  closeWindow: (id: string) => void;
  windowState: WindowState;
  AppIcon?: React.ComponentType<{ className?: string }>;
  headerLayout: string;
}> = ({
  canDrag,
  isMobile,
  dragHandleRef,
  handleContextMenu,
  handleMouseDown,
  handlePointerDown,
  toggleMaximize,
  toggleMinimize,
  closeWindow,
  windowState,
  AppIcon,
  headerLayout,
}) => (
  <header className={`${headerLayout} bg-muted/20 px-3`}>
    <button
      aria-label="Window title bar - drag to move"
      className={`${canDrag ? "drag-handle" : ""} flex flex-1 items-center gap-2 ${canDrag ? "h-full py-0" : "py-1"} ${isMobile ? "justify-between" : "pl-2"}`}
      onContextMenu={handleContextMenu}
      onDoubleClick={() => !isMobile && toggleMaximize(windowState.id)}
      onMouseDown={(event) => (canDrag ? handleMouseDown(event) : undefined)}
      onPointerDown={(event) =>
        canDrag ? handlePointerDown(event) : undefined
      }
      ref={dragHandleRef}
      type="button"
    >
      <div className="flex flex-1 items-center gap-2">
        {AppIcon && <AppIcon className="h-5 w-5 text-muted-foreground" />}
        <span className="font-medium text-base text-card-foreground">
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
        onMouseDown={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        type="button"
      >
        <Minus size={16} />
      </button>
      {!isMobile && (
        <button
          aria-label="Maximize window"
          className="rounded p-1 transition-colors duration-200 hover:bg-muted/30 hover:text-muted-foreground"
          onClick={() => toggleMaximize(windowState.id)}
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          type="button"
        >
          <Square size={16} />
        </button>
      )}
      <button
        aria-label="Close window"
        className="rounded p-1 transition-colors duration-200 hover:bg-destructive/15 hover:text-destructive-foreground"
        onClick={() => closeWindow(windowState.id)}
        onMouseDown={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        type="button"
      >
        <X size={16} />
      </button>
    </div>
  </header>
);

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

  const windowRef = useRef<HTMLDivElement | null>(null);

  const {
    dragHandleRef,
    handleMouseDown,
    handlePointerDown,
    handleContextMenu,
    isDragging,
  } = useWindowDrag({
    windowState,
    focusWindow,
    updateWindowPosition,
    showContextMenu,
  });

  const {
    handleMouseDown: handleResizeMouseDown,
    handlePointerDown: handleResizePointerDown,
  } = useWindowResize({
    windowState,
    updateWindowPosition,
    updateWindowSize,
    windowRef,
  });

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

  const appConfig = APPS.find((app) => app.id === windowState.appId);
  const AppIcon = appConfig?.icon;
  const AppComponent = appConfig?.component;

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

  return (
    <div className={windowClasses} ref={windowRef} style={windowStyle}>
      <WindowResizeHandles
        canResize={canResize}
        onMouseDown={handleResizeMouseDown}
        onPointerDown={handleResizePointerDown}
      />
      <WindowHeader
        AppIcon={AppIcon}
        canDrag={canDrag}
        closeWindow={closeWindow}
        dragHandleRef={dragHandleRef}
        handleContextMenu={handleContextMenu}
        handleMouseDown={handleMouseDown}
        handlePointerDown={handlePointerDown}
        headerLayout={headerLayout}
        isMobile={isMobile}
        toggleMaximize={toggleMaximize}
        toggleMinimize={toggleMinimize}
        windowState={windowState}
      />
      <div className={`flex-grow overflow-auto ${contentPadding}`}>
        {AppComponent && <AppComponent />}
      </div>
    </div>
  );
};

export default Window;
