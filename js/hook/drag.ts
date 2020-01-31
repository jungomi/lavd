import { useEffect, useState } from "react";

type DragPosition = {
  x: number;
  y: number;
};

export type DragScroll = {
  dragging: boolean;
  startDrag: (e: React.MouseEvent) => void;
  stopDrag: () => void;
};

export function useDragScroll<T extends HTMLElement>(
  ref: React.RefObject<T>
): DragScroll {
  const [dragPosition, setDragPosition] = useState<DragPosition | undefined>(
    undefined
  );
  const startDrag = (e: React.MouseEvent) => {
    if (
      e.button === 0 &&
      ref.current &&
      ref.current.contains(e.target as Node)
    ) {
      e.preventDefault();
      setDragPosition({ x: e.clientX, y: e.clientY });
    }
  };
  const stopDrag = () => {
    if (dragPosition) {
      setDragPosition(undefined);
    }
  };
  const updateScroll = (e: MouseEvent) => {
    if (dragPosition && ref.current) {
      e.preventDefault();
      const { scrollLeft, scrollTop } = ref.current;
      const newX = scrollLeft + dragPosition.x - e.clientX;
      const newY = scrollTop + dragPosition.y - e.clientY;
      ref.current.scrollLeft = newX;
      ref.current.scrollTop = newY;
      setDragPosition({ x: e.clientX, y: e.clientY });
    }
  };
  useEffect(() => {
    window.addEventListener("mousemove", updateScroll);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", updateScroll);
      window.removeEventListener("mouseup", stopDrag);
    };
  });

  return { dragging: dragPosition !== undefined, startDrag, stopDrag };
}
