import { BarChart } from "lucide-react";

interface GraphReopenerProps {
  onReopen: () => void;
}

export default function GraphReopener({ onReopen }: GraphReopenerProps) {
  return (
    <div className="mb-4">
      <button
        onClick={onReopen}
        className="w-1/4 flex items-center justify-center space-x-2"
      >
        <BarChart size={16} />
        <span>Reopen Graph</span>
      </button>
    </div>
  );
}
