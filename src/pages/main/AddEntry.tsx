import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Weight,
  Footprints,
  Droplet,
  Candy,
  Soup,
  BookText,
} from "lucide-react";

const AddEntry = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  // State declarations
  const [date, setDate] = useState(today);
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [steps, setSteps] = useState<number | "">("");
  const [sugarLevel, setSugarLevel] = useState("medium");
  const [oilyFoodLevel, setOilyFoodLevel] = useState("medium");
  const [sugarReading, setSugarReading] = useState<number | "">("");
  const [dailySummary, setDailySummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants for select options and suggestions
  const SUGAR_LEVELS = [
    { value: "no_sugar", label: "No Sugar" },
    { value: "very_low", label: "Very Low" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "very_high", label: "Very High" },
  ];

  const SUGGESTIONS: { [key: string]: string } = {
    no_sugar: "Fantastic! Assuming you had no added sugars. This is highly beneficial for your health.",
    very_low: "Great! Assuming you had a very small sweet item (e.g., a single piece of candy). Stick to natural sugars like fruits.",
    low: "Good job! Assuming you had 1-2 small sweet items (e.g., sugar-free chewing gums or a small cookie). Be mindful of hidden sugars.",
    medium: "Maintain awareness. Assuming you had a regular-sized sweet snack (e.g., a can of soda or a chocolate bar). Consider reducing this.",
    high: "High intake. Assuming you had multiple sugary snacks or drinks. Try replacing these with healthier alternatives.",
    very_high: "Very high intake. Assuming you had several large sugary items throughout the day. It's crucial to reduce this for better health.",
  };

  const OILY_FOOD_LEVELS = [
    { value: "none", label: "None" },
    { value: "very_low", label: "Very Low" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "very_high", label: "Very High" },
  ];

  const OILY_FOOD_SUGGESTIONS: { [key: string]: string } = {
    none: "Excellent! Assuming no fried or processed junk food. This is a great step for your health.",
    very_low: "Superb! Assuming a very small portion of oily food (e.g., a few fries). Focus on lean proteins and vegetables.",
    low: "Good job! Assuming a small side of oily food (e.g., a small pack of chips). Opt for healthy fats from avocados and nuts.",
    medium: "Be mindful. Assuming a single regular meal contained oily/junk food (e.g., a burger). Try baking or grilling instead.",
    high: "High intake. Assuming multiple meals or snacks were oily/junk food. Consider reducing fast food and processed snacks.",
    very_high: "Very high intake. Assuming most of your meals were oily/junk food. This can negatively impact your health.",
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add an entry.");
      return;
    }
    if (weightKg === "" || steps === "" || sugarReading === "") {
      toast.error("Please fill in your weight, steps, and sugar reading.");
      return;
    }

    setIsSubmitting(true);
    const logEntry = {
      date,
      weightKg,
      steps,
      sugarLevel,
      oilyFoodLevel,
      sugarReading,
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

  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {children}
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Daily Log</h1>
        <p className="text-gray-600 mb-8">Log your activities and diet for the day.</p>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg space-y-8"
        >
          {/* General Section */}
          <div className="relative">
            <IconWrapper><Calendar className="text-gray-400" /></IconWrapper>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10 pr-4 py-3 block w-full border-2 border-gray-500 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* Activity Section */}
          <fieldset className="border-t border-gray-200 pt-6">
            <legend className="text-lg font-semibold text-gray-800 px-2 -ml-2">Activity</legend>
            <div className="space-y-6 mt-4">
              <div className="relative">
                <IconWrapper><Weight className="text-gray-400" /></IconWrapper>
                <input
                  type="number"
                  id="weight"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="pl-10 pr-4 py-3 w-full border-2 border-gray-500 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Weight (kg)"
                />
              </div>
              <div className="relative">
                <IconWrapper><Footprints className="text-gray-400" /></IconWrapper>
                <input
                  type="number"
                  id="steps"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                  className="pl-10 pr-4 py-3 w-full border-2 border-gray-500 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Steps taken"
                />
              </div>
            </div>
          </fieldset>
          
          {/* Diet Section */}
          <fieldset className="border-t border-gray-200 pt-6">
            <legend className="text-lg font-semibold text-gray-800 px-2 -ml-2">Diet</legend>
            <div className="space-y-6 mt-4">
              <div className="relative">
                <IconWrapper><Droplet className="text-gray-400" /></IconWrapper>
                <input
                  type="number"
                  id="sugarReading"
                  value={sugarReading}
                  onChange={(e) => setSugarReading(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                  className="pl-10 pr-4 py-3 w-full border-2 border-gray-500 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Sugar Reading (mg/dL)"
                />
              </div>
              <div className="relative">
                <IconWrapper><Candy className="text-gray-400" /></IconWrapper>
                <select
                  id="sugarLevel"
                  value={sugarLevel}
                  onChange={(e) => setSugarLevel(e.target.value)}
                  className="pl-10 pr-4 py-3 block w-full border-2 border-gray-500 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 sm:text-sm"
                >
                  {SUGAR_LEVELS.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
                </select>
              </div>
              <div className="relative">
                <IconWrapper><Soup className="text-gray-400" /></IconWrapper>
                <select
                  id="oilyFoodLevel"
                  value={oilyFoodLevel}
                  onChange={(e) => setOilyFoodLevel(e.target.value)}
                  className="pl-10 pr-4 py-3 block w-full border-2 border-gray-500 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 sm:text-sm"
                >
                  {OILY_FOOD_LEVELS.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Summary Section */}
          <fieldset className="border-t border-gray-200 pt-6">
             <legend className="text-lg font-semibold text-gray-800 px-2 -ml-2">Summary</legend>
            <div className="relative mt-4">
              <IconWrapper><BookText className="text-gray-400" /></IconWrapper>
              <textarea
                id="summary"
                rows={4}
                value={dailySummary}
                onChange={(e) => setDailySummary(e.target.value)}
                className="pl-10 pr-4 py-3 block w-full border-2 border-gray-500 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="Any notes about your day?"
              ></textarea>
            </div>
          </fieldset>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save Daily Log"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntry;
