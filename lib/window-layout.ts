import type { Point, Size } from "../types";

export const TASKBAR_HEIGHT = 64;
export const WINDOW_MIN_WIDTH = 200;
export const WINDOW_MIN_HEIGHT = 150;
export const WINDOW_EDGE_GAP = 20;

type Viewport = {
  width: number;
  height: number;
};

type ClampArgs = {
  size: Size;
  position: Point;
  viewport: Viewport;
  minWidth?: number;
  minHeight?: number;
};

export const clampWindowPlacement = ({
  size,
  position,
  viewport,
  minWidth = WINDOW_MIN_WIDTH,
  minHeight = WINDOW_MIN_HEIGHT,
}: ClampArgs) => {
  const maxWidth = Math.max(minWidth, viewport.width - WINDOW_EDGE_GAP);
  const maxHeight = Math.max(minHeight, viewport.height - WINDOW_EDGE_GAP);

  const clampedWidth = Math.min(Math.max(size.width, minWidth), maxWidth);
  const clampedHeight = Math.min(Math.max(size.height, minHeight), maxHeight);

  const minVisibleWidth = Math.min(minWidth, clampedWidth * 0.3);
  const maxX = Math.max(0, viewport.width - clampedWidth - WINDOW_EDGE_GAP);
  const maxY = Math.max(0, viewport.height - clampedHeight - WINDOW_EDGE_GAP);

  const clampedX = Math.min(
    Math.max(position.x, -clampedWidth + minVisibleWidth),
    maxX
  );
  const clampedY = Math.min(Math.max(position.y, 0), maxY);

  return {
    size: {
      width: clampedWidth,
      height: clampedHeight,
    },
    position: {
      x: clampedX,
      y: clampedY,
    },
  };
};
