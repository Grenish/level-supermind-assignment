"use client";

import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, ChartData } from "chart.js/auto";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useCanvas } from "@/context/CanvasContext";

export default function Canvas() {
  const { isCanvasVisible, closeCanvas, chartData } = useCanvas();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const processChartData = (data: any): ChartData | null => {
    if (!data || !data.engagement_metrics) return null;

    const processedData = data.engagement_metrics.reduce((acc: any, curr: any) => {
      acc[curr.post_type] = {
        Likes: curr.likes_per_100_views,
        Shares: curr.shares_per_100_views,
        Comments: curr.comments_per_100_views,
        Saves: curr.saves_per_100_views,
      };
      return acc;
    }, {});

    const labels = Object.keys(processedData);
    const metrics = Object.keys(processedData[labels[0]]);

    const datasets = metrics.map((metric, index) => ({
      label: metric,
      data: labels.map((label) => processedData[label][metric]),
      borderColor: `hsl(${index * (360 / metrics.length)}, 70%, 50%)`,
      backgroundColor: `hsla(${index * (360 / metrics.length)}, 70%, 50%, 0.2)`,
    }));

    return { labels, datasets };
  };

  useEffect(() => {
    if (chartRef.current && chartData) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const processedData = processChartData(chartData);
        if (processedData) {
          const config: ChartConfiguration = {
            type: "bar",
            data: processedData,
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Engagement Metrics Analysis",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Engagement per 100 Views",
                  },
                },
              },
            },
          };
          chartInstance.current = new Chart(ctx, config);
        }
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  const variants = {
    hidden: { width: 0, opacity: 0, overflow: "hidden" },
    visible: { width: "100%", opacity: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate={isCanvasVisible ? "visible" : "hidden"}
      exit="hidden"
      variants={variants}
      transition={{ type: "spring", stiffness: 70, damping: 15 }}
      className="w-2/3 h-screen bg-neutral-900"
    >
      <div className="w-full h-full p-5 bg-gray-800 rounded-xl text-gray-200">
        <button onClick={closeCanvas} className="mb-4">
          <X size={24} />
        </button>
        <div>
          {chartData ? (
            <canvas ref={chartRef} />
          ) : (
            <p>No chart data available</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
