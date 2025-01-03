"use client";

import Canvas from "@/components/Canvas";
import { CanvasProvider } from "./CanvasContext";

export default function CanvasWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CanvasProvider>
      {children}
      <Canvas />
    </CanvasProvider>
  );
}
