"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ChartData } from "chart.js";

type CanvasContextType = {
  isCanvasVisible: boolean;
  openCanvas: () => void;
  closeCanvas: () => void;
  chartData: ChartData<"line"> | null;
  setChartData: (data: ChartData<"line">) => void;
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [isCanvasVisible, setIsCanvasVisible] = useState(false);
  const [chartData, setChartData] = useState<ChartData<"line"> | null>(null);

  const openCanvas = () => setIsCanvasVisible(true);
  const closeCanvas = () => setIsCanvasVisible(false);

  return (
    <CanvasContext.Provider
      value={{
        isCanvasVisible,
        openCanvas,
        closeCanvas,
        chartData,
        setChartData,
      }}
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
