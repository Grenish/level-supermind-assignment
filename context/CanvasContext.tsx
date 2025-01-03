"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type CanvasContextType = {
  isCanvasVisible: boolean;
  openCanvas: () => void;
  closeCanvas: () => void;
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [isCanvasVisible, setIsCanvasVisible] = useState(false);

  const openCanvas = () => setIsCanvasVisible(true);
  const closeCanvas = () => setIsCanvasVisible(false);

  return (
    <CanvasContext.Provider
      value={{ isCanvasVisible, openCanvas, closeCanvas }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};
