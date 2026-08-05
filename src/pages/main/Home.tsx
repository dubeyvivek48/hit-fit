import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { getDailyTip, Tip } from "../../lib/tips";
import { Lightbulb, Droplet } from "lucide-react";

interface UserData {
  goal: "weight_loss" | "weight_gain";
  currentWeight: number;
  targetWeight: number;
}

interface Log {
  date: string;
  weightKg: number;
  steps: number;
  oilyFoodLevel: string;
  sugarLevel: string;
  sugarReading: number;
}

const Home = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [latestLog, setLatestLog] = useState<Log | null>(null);
  const [startWeight, setStartWeight] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [dailyTip, setDailyTip] = useState<Tip | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (startWeight && latestLog && userData) {
      const current = latestLog.weightKg;
      const target = userData.targetWeight;

      if (startWeight === target) {
        setProgress(current === target ? 100 : 0);
        return;
      }
      
      const progressPercent = Math.round(((startWeight - current) / (startWeight - target)) * 100);
      
      setProgress(Math.max(0, Math.min(progressPercent, 100)));
    }
  }, [startWeight, latestLog, userData]);

  const fetchData = async () => {
    if (!user) return;

    // Fetch user profile data
    const userDocRef = doc(db, `users/${user.uid}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data() as UserData;
      setUserData(data);
    }

    // Fetch logs
    const logsCollectionRef = collection(db, `users/${user.uid}/daily_logs`);

    // Get latest log
    const latestQuery = query(logsCollectionRef, orderBy("date", "desc"), limit(1));
    const latestSnapshot = await getDocs(latestQuery);
    let log: Log | null = null;
    if (!latestSnapshot.empty) {
      log = latestSnapshot.docs[0].data() as Log;
      setLatestLog(log);
    }

    // Get first log for start weight for progress calculation
    const firstQuery = query(logsCollectionRef, orderBy("date", "asc"), limit(1));
    const firstSnapshot = await getDocs(firstQuery);
    if (!firstSnapshot.empty) {
      setStartWeight(firstSnapshot.docs[0].data().weightKg);
    } else if (userDoc.exists()) {
      // Fallback to initial weight from profile if no logs exist
      setStartWeight((userDoc.data() as UserData).currentWeight);
    }

    // Determine the tip
    if (userDoc.exists()) {
      const goal = (userDoc.data() as UserData).goal;
      const tip = getDailyTip(goal, log);
      setDailyTip(tip);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Welcome, {user?.displayName || "User"}!
      </h1>

      {/* Daily Tip Banner */}
      {dailyTip && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-lg shadow-md flex items-start">
          <Lightbulb className="h-6 w-6 mr-3 text-blue-500" />
          <div>
            <p className="font-bold">Daily Tip</p>
            <p>{dailyTip.text}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress Card */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Progress</h3>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-blue-600"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <span className="text-xl font-bold text-gray-800">{progress}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Weight</h3>
          <p className="text-3xl font-bold text-gray-900">
            {latestLog?.weightKg ?? userData?.currentWeight ?? "N/A"}{" "}
            <span className="text-lg font-normal">kg</span>
          </p>
          <p className="text-sm text-gray-500">
            Start: {userData?.currentWeight ?? "N/A"} kg
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Steps Today</h3>
          <p className="text-3xl font-bold text-gray-900">
            {latestLog?.steps ?? "N/A"}
          </p>
          <p className="text-sm text-gray-500">Keep it up!</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Sugar Reading</h3>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-gray-900">
              {latestLog?.sugarReading ?? "N/A"}
            </p>
            <span className="text-sm text-gray-600 ml-1">mg/dL</span>
          </div>
          <p className="text-sm text-gray-500">Latest reading</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
