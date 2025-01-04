"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useCanvas } from "@/context/CanvasContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Canvas() {
  const { isCanvasVisible, closeCanvas, chartData: metrics } = useCanvas();

  const processChartData = (data: any) => {
    const labels = ["Likes", "Shares", "Comments", "Saves"];
    const datasets = Object.keys(data).map((key, index) => ({
      label: key,
      data: labels.map((label) => data[key][label]),
      borderColor: `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.2)`,
    }));

    return { labels, datasets };
  };

  const chartData = metrics ? processChartData(metrics) : null;

  const variants = {
    hidden: { width: 0, opacity: 0, overflow: "hidden" },
    visible: { width: "100%", opacity: 1 },
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Social Media Metrics",
      },
    },
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
            <Line options={options} data={chartData} />
          ) : (
            <p>No chart data available</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
