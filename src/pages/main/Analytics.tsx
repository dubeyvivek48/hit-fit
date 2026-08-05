import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";

interface DailyLog {
  date: string;
  weightKg: number;
  steps: number;
  oilyFoodPercent: number;
}

const Analytics = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DailyLog[]>([]);
  const [timeRange, setTimeRange] = useState<"7" | "30">("7");
  const [correlationInsight, setCorrelationInsight] = useState<string>("");

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, timeRange]);

  const fetchData = async () => {
    if (!user) return;

    const logsCollection = collection(db, `users/${user.uid}/daily_logs`);
    const q = query(
      logsCollection,
      orderBy("date", "desc"),
      limit(parseInt(timeRange)),
    );

    const querySnapshot = await getDocs(q);
    const logs = querySnapshot.docs
      .map((doc) => doc.data() as DailyLog)
      .reverse();
    setData(logs);
    generateCorrelationInsight(logs);
  };

  const calculateCorrelation = (
    data: DailyLog[],
    key1: keyof DailyLog,
    key2: keyof DailyLog,
  ) => {
    if (data.length < 2) return 0;

    const n = data.length;
    const sum1 = data.reduce((acc, val) => acc + (val[key1] as number), 0);
    const sum2 = data.reduce((acc, val) => acc + (val[key2] as number), 0);
    const sum1Sq = data.reduce(
      (acc, val) => acc + (val[key1] as number) ** 2,
      0,
    );
    const sum2Sq = data.reduce(
      (acc, val) => acc + (val[key2] as number) ** 2,
      0,
    );
    const pSum = data.reduce(
      (acc, val) => acc + (val[key1] as number) * (val[key2] as number),
      0,
    );

    const numerator = n * pSum - sum1 * sum2;
    const denominator = Math.sqrt(
      (n * sum1Sq - sum1 ** 2) * (n * sum2Sq - sum2 ** 2),
    );

    if (denominator === 0) return 0;

    return numerator / denominator;
  };

  const generateCorrelationInsight = (logs: DailyLog[]) => {
    if (logs.length < 2) {
      setCorrelationInsight("Not enough data to generate insights.");
      return;
    }

    const weightStepsCorrelation = calculateCorrelation(
      logs,
      "weightKg",
      "steps",
    );
    const weightOilyFoodCorrelation = calculateCorrelation(
      logs,
      "weightKg",
      "oilyFoodPercent",
    );

    let insight = "Correlation Insights:";
    if (Math.abs(weightStepsCorrelation) > 0.5) {
      insight += `- There is a **${
        weightStepsCorrelation > 0 ? "positive" : "negative"
      }** correlation between your weight and steps. `;
    }
    if (Math.abs(weightOilyFoodCorrelation) > 0.5) {
      insight += `- There is a **${
        weightOilyFoodCorrelation > 0 ? "positive" : "negative"
      }** correlation between your weight and oily food intake.`;
    }

    if (
      Math.abs(weightStepsCorrelation) < 0.5 &&
      Math.abs(weightOilyFoodCorrelation) < 0.5
    ) {
      insight =
        "Keep logging your data to see how your habits impact your weight.";
    }

    setCorrelationInsight(insight);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Analytics</h1>

      <div className="flex justify-center mb-4 space-x-2">
        <button
          onClick={() => setTimeRange("7")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            timeRange === "7"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => setTimeRange("30")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            timeRange === "30"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Last 30 Days
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Progress Chart
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="weightKg"
              stroke="#8884d8"
              name="Weight (kg)"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="steps"
              stroke="#82ca9d"
              name="Steps"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="oilyFoodPercent"
              stroke="#ffc658"
              name="Oily Food (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Correlation Insights
        </h2>
        <p className="text-gray-600 whitespace-pre-line">
          {correlationInsight}
        </p>
      </div>
    </div>
  );
};

export default Analytics;
