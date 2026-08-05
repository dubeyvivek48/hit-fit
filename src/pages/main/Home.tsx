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
import { Lightbulb } from "lucide-react";

interface UserData {
  goal: "weight_loss" | "weight_gain";
  currentWeight: number;
  targetWeight: number;
}

interface LatestLog {
  date: string;
  weightKg: number;
  steps: number;
  oilyFoodPercent: number;
  sugarTaken: boolean;
}

const Home = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [latestLog, setLatestLog] = useState<LatestLog | null>(null);
  const [dailyTip, setDailyTip] = useState<Tip | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    // Fetch user profile data
    const userDocRef = doc(db, `users/${user.uid}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      setUserData(userDoc.data() as UserData);
    }

    // Fetch latest log
    const logsCollectionRef = collection(db, `users/${user.uid}/daily_logs`);
    const q = query(logsCollectionRef, orderBy("date", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    let log: LatestLog | null = null;
    if (!querySnapshot.empty) {
      log = querySnapshot.docs[0].data() as LatestLog;
      setLatestLog(log);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Weight</h3>
          <p className="text-3xl font-bold text-gray-900">
            {latestLog?.weightKg ?? userData?.currentWeight ?? "N/A"}{" "}
            <span className="text-lg font-normal">kg</span>
          </p>
          <p className="text-sm text-gray-500">
            Target: {userData?.targetWeight ?? "N/A"} kg
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
          <h3 className="text-lg font-semibold text-gray-700">Diet Focus</h3>
          <p className="text-xl font-semibold text-gray-800">
            Oily Food: {latestLog?.oilyFoodPercent ?? "N/A"}%
          </p>
          <p className="text-sm text-gray-500">
            Sugar taken: {latestLog?.sugarTaken ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;