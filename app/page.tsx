"use client";

import { BarChart, BrainCircuit, ChevronRight, Send, User } from "lucide-react";
import { useCanvas } from "@/context/CanvasContext";

export default function Page() {
  const { openCanvas } = useCanvas();

  return (
    <div className="h-screen w-full bg-neutral-900 relative">
      <div className="h-[90vh] flex flex-col items-center overflow-y-scroll">
        <div className="w-full max-w-2xl p-5 text-white flex gap-3 flex-wrap">
          <div className="p-1 w-[25px] h-[25px] flex items-center justify-center rounded-full border-2">
            <User size={15} />
          </div>
          <div className="flex-1 bg-neutral-800 text-gray-200 p-2 rounded-xl">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem nihil itaque modi necessitatibus perspiciatis eaque
              voluptatibus accusantium facere, velit adipisci, quasi deserunt
              ducimus voluptates cum illo harum soluta! Cumque a impedit
              molestias minus sequi.
            </p>
          </div>
        </div>
        <div className="w-full max-w-2xl p-5 text-white flex gap-3 flex-wrap">
          <div className="p-1 w-[25px] h-[25px] flex items-center justify-center rounded-full border-2">
            <BrainCircuit size={15} />
          </div>
          <div className="flex-1 flex flex-col">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem nihil itaque modi necessitatibus perspiciatis eaque
              voluptatibus accusantium facere, velit adipisci, quasi deserunt
              ducimus voluptates cum illo harum soluta! Cumque a impedit
              molestias minus sequi.
            </p>
            <button
              onClick={openCanvas}
              className="bg-gray-800 w-fit my-3 p-2 rounded-xl text-xs sm:text-sm md:text-base py-4 px-5 flex items-center gap-3"
            >
              <BarChart size={16} />
              <p>Social media graph</p>
              <ChevronRight size={16} />
            </button>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis,
              nesciunt vitae vero eveniet modi optio, iusto nihil dolore
              perferendis voluptates odit? Recusandae, rem.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 w-full max-w-2xl flex items-center p-2 overflow-hidden rounded-xl px-2 absolute bottom-5 left-1/2 transform -translate-x-1/2 z-50">
        <input
          type="text"
          placeholder="Chat with Reah"
          className="w-full bg-transparent outline-none text-sm sm:text-base"
        />
        <button className="ml-2 p-1 sm:p-2">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
