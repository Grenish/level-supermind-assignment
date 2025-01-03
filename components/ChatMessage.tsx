import { Message } from "ai";

interface ChatMessageProps {
  message: Message & { graphData?: any };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isGraphMessage = message.role === "assistant" && "graphData" in message;

  return (
    <div
      className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
    >
      <div
        className={`inline-block p-3 rounded-lg ${
          message.role === "user"
            ? "bg-blue-500 text-white"
            : "bg-white text-black shadow"
        }`}
      >
        {isGraphMessage ? (
          <div>
            <p>{message.content}</p>
            <p className="text-sm text-gray-600 mt-2">
              A graph has been generated based on your request. You can view it
              in the side panel.
            </p>
          </div>
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  );
}
