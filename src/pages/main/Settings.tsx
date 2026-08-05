import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

type Goal = "weight_loss" | "weight_gain";

const Settings = () => {
  const { user, logout } = useAuth();
  const [goal, setGoal] = useState<Goal>("weight_loss");
  const [targetWeight, setTargetWeight] = useState<number>(70);
  const [currentWeight, setCurrentWeight] = useState<number>(75);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, `users/${user.uid}`);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setGoal(data.goal || "weight_loss");
          setTargetWeight(data.targetWeight || 70);
          setCurrentWeight(data.currentWeight || 75);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to save settings.");
      return;
    }

    const userDocRef = doc(db, `users/${user.uid}`);
    try {
      await setDoc(
        userDocRef,
        {
          goal,
          targetWeight,
          currentWeight,
        },
        { merge: true }
      );
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
      console.error("Error saving settings: ", error);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <div className="mb-6">
          <label
            htmlFor="goal"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            My Goal
          </label>
          <select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value as Goal)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="weight_loss">Weight Loss</option>
            <option value="weight_gain">Weight Gain</option>
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="currentWeight"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Current Weight (kg)
          </label>
          <input
            type="number"
            id="currentWeight"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-8">
          <label
            htmlFor="targetWeight"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Target Weight (kg)
          </label>
          <input
            type="number"
            id="targetWeight"
            value={targetWeight}
            onChange={(e) => setTargetWeight(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-4"
        >
          Save Preferences
        </button>

        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>

      <div className="mt-6 text-center">
        {user && (
          <p className="text-sm text-gray-500">Logged in as {user.email}</p>
        )}
      </div>
    </div>
  );
};

export default Settings;