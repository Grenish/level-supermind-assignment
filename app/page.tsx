"use client";

import React, { useState, useCallback } from "react";
import { BarChart, BrainCircuit, ChevronRight, Send, User } from "lucide-react";
import { useCanvas } from "@/context/CanvasContext";
import { LangflowClient } from "@/util/langflowClient";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

const flowIdOrName = process.env.NEXT_PUBLIC_FLOW_ID!;
const langflowId = process.env.NEXT_PUBLIC_LANGFLOW_ID!;
const apiUrl = process.env.NEXT_PUBLIC_LANGFLOW_API_URL!;

const client = new LangflowClient(apiUrl);

function SkeletonLoader() {
  return (
    <div className="w-full max-w-2xl p-5 text-white flex gap-3 flex-wrap">
      <div className="p-1 w-[25px] h-[25px] rounded-full bg-gray-600 animate-pulse"></div>
      <div className="flex-1 bg-neutral-800 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-gray-500 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-500 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export default function Page() {
  const { openCanvas, setChartData } = useCanvas();
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const parseAndSanitizeMarkdown = useCallback((content: string) => {
    const rawHtml = marked.parse(content);
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    return { __html: sanitizedHtml };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await client.runFlow(
        flowIdOrName,
        langflowId,
        input,
        "chat",
        "chat",
        {}, // default tweaks
        false // not streaming
      );

      if (response && response.outputs && response.outputs.length > 0) {
        const flowOutputs = response.outputs[0];
        const firstComponentOutputs = flowOutputs.outputs[0];
        const output = firstComponentOutputs.outputs.message;

        const assistantMessage = {
          role: "assistant",
          content: output.message.text,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Process and pass metrics data to Canvas
        try {
          const jsonMatch = output.message.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonString = jsonMatch[0];
            const metricsData = JSON.parse(jsonString);
            setChartData(metricsData);
          }
        } catch (error) {
          console.error("Error parsing JSON from assistant's message:", error);
        }
      }
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "An error occurred. Please check your connection or try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-neutral-900 relative">
      <div className="h-[90vh] flex flex-col items-center overflow-y-scroll">
        {messages.map((message, index) => (
          <div
            key={index}
            className="w-full max-w-2xl p-5 text-white flex gap-3 flex-wrap"
          >
            <div className="p-1 w-[25px] h-[25px] flex items-center justify-center rounded-full border-2 mt-2">
              {message.role === "user" ? (
                <User size={15} />
              ) : (
                <BrainCircuit size={15} />
              )}
            </div>
            <div
              className={`flex-1 p-2 rounded-xl ${
                message.role === "user" ? "bg-neutral-800" : "bg-transparent"
              }`}
            >
              <div
                className="mb-2"
                dangerouslySetInnerHTML={parseAndSanitizeMarkdown(
                  message.content
                )}
              />
              {/* {message.role === "assistant" && (
                <button
                  onClick={openCanvas}
                  className="bg-gray-800 w-fit my-3 p-1 rounded-xl text-xs sm:text-sm md:text-base py-4 px-5 flex items-center gap-3"
                >
                  <BarChart size={16} />
                  <p>View Graph</p>
                  <ChevronRight size={16} />
                </button>
              )} */}
            </div>
          </div>
        ))}

        {loading && <SkeletonLoader />}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 w-full max-w-2xl flex items-center p-2 overflow-hidden rounded-xl px-2 absolute bottom-5 left-1/2 transform -translate-x-1/2 z-50"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Chat with Reah"
          className="w-full bg-transparent outline-none text-sm sm:text-base"
        />
        <button type="submit" className="ml-2 p-1 sm:p-2">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
