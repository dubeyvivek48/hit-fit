export interface Tip {
  id: string;
  category: "weight_loss" | "weight_gain";
  text: string;
  condition?: (log: any) => boolean;
}

export const tips: Tip[] = [
  // Weight Loss Tips
  {
    id: "wl_1",
    category: "weight_loss",
    text: "Drink a glass of water before every meal. It helps you feel fuller and eat less.",
  },
  {
    id: "wl_2",
    category: "weight_loss",
    text: "High oily food intake yesterday! Try incorporating more lean proteins and vegetables today.",
    condition: (log) => log && log.oilyFoodPercent > 40,
  },
  {
    id: "wl_3",
    category: "weight_loss",
    text: "You had sugar yesterday. To manage cravings, try snacking on fruits like berries or an apple.",
    condition: (log) => log && log.sugarTaken,
  },
  {
    id: "wl_4",
    category: "weight_loss",
    text: "Great job on your steps! Physical activity is key to sustainable weight loss.",
    condition: (log) => log && log.steps > 10000,
  },
  {
    id: "wl_5",
    category: "weight_loss",
    text: "Don't forget to include fiber-rich foods like oats, beans, and broccoli in your diet.",
  },
  {
    id: "wl_6",
    category: "weight_loss",
    text: "Try to get 7-8 hours of quality sleep. Poor sleep can affect hormones that regulate appetite.",
  },
  {
    id: "wl_7",
    category: "weight_loss",
    text: "Avoid sugary drinks like sodas and juices. Opt for water, herbal tea, or black coffee.",
  },
  {
    id: "wl_8",
    category: "weight_loss",
    text: "Practice mindful eating. Pay attention to your food and how you feel while eating.",
  },
  {
    id: "wl_9",
    category: "weight_loss",
    text: "Low step count yesterday. Try to schedule a short walk today, even 15 minutes helps!",
    condition: (log) => log && log.steps < 5000,
  },
  {
    id: "wl_10",
    category: "weight_loss",
    text: "Meal prepping can help you make healthier choices throughout the week.",
  },

  // Weight Gain Tips
  {
    id: "wg_1",
    category: "weight_gain",
    text: "Incorporate nutrient-dense snacks like nuts, seeds, and avocados into your day.",
  },
  {
    id: "wg_2",
    category: "weight_gain",
    text: "Consider adding a protein shake or smoothie to your daily routine, especially after workouts.",
  },
  {
    id: "wg_3",
    category: "weight_gain",
    text: "Eat more frequently. Aim for 5-6 smaller, nutrient-rich meals throughout the day.",
  },
  {
    id: "wg_4",
    category: "weight_gain",
    text: "Don't fill up on water before meals. Drink most of your fluids between meals.",
  },
  {
    id: "wg_5",
    category: "weight_gain",
    text: "Add healthy fats to your meals, such as olive oil, nut butters, and fatty fish.",
  },
  {
    id: "wg_6",
    category: "weight_gain",
    text: "Focus on strength training exercises to build muscle mass along with weight.",
  },
  {
    id: "wg_7",
    category: "weight_gain",
    text: "Choose full-fat dairy products over low-fat or fat-free options.",
  },
  {
    id: "wg_8",
    category: "weight_gain",
    text: "Make sure you're eating enough protein. Aim for 1.5-2.2 grams of protein per kilogram of body weight.",
  },
  {
    id: "wg_9",
    category: "weight_gain",
    text: "Get enough rest. Your muscles need time to recover and grow after workouts.",
  },
  {
    id: "wg_10",
    category: "weight_gain",
    text: "Consider a healthy dessert. A bowl of yogurt with fruit or a handful of dark chocolate can add extra calories.",
  },
];

export const getDailyTip = (
  goal: "weight_loss" | "weight_gain",
  latestLog: any | null
): Tip => {
  const relevantTips = tips.filter((tip) => tip.category === goal);

  // Find a conditional tip that matches the latest log
  if (latestLog) {
    const conditionalTip = relevantTips.find(
      (tip) => tip.condition && tip.condition(latestLog)
    );
    if (conditionalTip) {
      return conditionalTip;
    }
  }

  // Fallback to a random non-conditional tip from the relevant category
  const nonConditionalTips = relevantTips.filter((tip) => !tip.condition);
  const randomIndex = Math.floor(Math.random() * nonConditionalTips.length);
  return nonConditionalTips[randomIndex];
};