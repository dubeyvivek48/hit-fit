import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddEntry = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [steps, setSteps] = useState<number | "">("");
  const [sugarTaken, setSugarTaken] = useState(false);
  const [oilyFoodPercent, setOilyFoodPercent] = useState(20);
  const [dailySummary, setDailySummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add an entry.");
      return;
    }
    if (weightKg === "" || steps === "") {
      toast.error("Please fill in your weight and steps.");
      return;
    }

    setIsSubmitting(true);
    const logEntry = {
      date,
      weightKg,
      steps,
      sugarTaken,
      oilyFoodPercent,
      dailySummary,
      createdAt: new Date().toISOString(),
    };

    try {
      const logsCollectionRef = collection(db, `users/${user.uid}/daily_logs`);
      await setDoc(doc(logsCollectionRef, date), logEntry);
      toast.success("Daily log saved successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to save log. Please try again.");
      console.error("Error adding document: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Daily Log</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto"
      >
        {/* Form fields will go here */}
      </form>
    </div>
  );
};

export default AddEntry;