"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useCanvas } from "@/context/CanvasContext";

export default function Canvas() {
  const { isCanvasVisible, closeCanvas } = useCanvas();

  const variants = {
    hidden: { width: 0, opacity: 10, overflow: "hidden" },
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
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
            repellendus dolor omnis.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
