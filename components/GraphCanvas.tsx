import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Resizable } from "re-resizable";

interface GraphData {
  title: string;
  type: string;
  xAxis: string;
  yAxis: string;
  data: Array<{ label: string; value: number }>;
  analysis: string;
}

interface GraphCanvasProps {
  graphData: GraphData;
  onClose: () => void;
  setCanvasWidth: (width: string) => void;
}

export default function GraphCanvas({
  graphData,
  onClose,
  setCanvasWidth,
}: GraphCanvasProps) {
  const [height, setHeight] = useState(600);

  const handleResize = useCallback(
    (e, direction, ref, d) => {
      setHeight(ref.style.height);
      setCanvasWidth(ref.style.width);
    },
    [setCanvasWidth]
  );

  const renderChart = () => {
    const ChartComponent =
      graphData.type.toLowerCase() === "bar" ? BarChart : LineChart;
    const DataComponent = graphData.type.toLowerCase() === "bar" ? Bar : Line;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={graphData.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            label={{
              value: graphData.xAxis,
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            label={{
              value: graphData.yAxis,
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          <DataComponent
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Resizable
      defaultSize={{ width: "100%", height: height }}
      minWidth="300px"
      maxWidth="80%"
      onResizeStop={handleResize}
      enable={{ right: true }}
    >
      <Card className="h-full overflow-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {graphData.title}
            <button onClick={onClose}>
              Close
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-semibold">Graph Analysis:</h3>
            <p>{graphData.analysis}</p>
          </div>
        </CardContent>
      </Card>
    </Resizable>
  );
}
