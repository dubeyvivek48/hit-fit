export interface DailyLog {
    date: string;
    weightKg: number;
    steps: number;
    sugarTaken: boolean;
    oilyFoodPercent: number;
    dailySummary: string;
    createdAt: string;
}

export type UserGoal = "weight_loss" | "weight_gain";

export interface UserProfile {
    goal: UserGoal;
    targetWeight: number;
    currentWeight: number;
    [key: string]: any;
}

const weightLossTips = [
    "Swap sugary drinks for water or herbal tea to cut down on empty calories.",
    "Aim for at least 30 minutes of moderate exercise, like brisk walking, most days of the week.",
    "Fill half your plate with vegetables to increase fiber and nutrient intake, which helps you feel full.",
    "If you had a high percentage of oily food, try grilling, baking, or steaming your food instead of frying.",
    "Struggling with sugar cravings after a 'sugarTaken' day? Try eating a piece of fruit instead.",
    "Incorporate more lean protein like chicken, fish, or legumes to keep you full and support muscle.",
    "Mindful eating: pay attention to your food and hunger cues to avoid overeating.",
    "Get 7-9 hours of quality sleep per night; poor sleep can disrupt hunger hormones.",
    "Don't skip breakfast. A protein-rich breakfast can reduce cravings later in the day.",
    "Watch your portion sizes. Use smaller plates to help control how much you eat.",
    "Limit processed foods, which are often high in calories, unhealthy fats, and sugar.",
    "Increase your daily steps. Even small walks add up and contribute to your calorie burn.",
    "Drink a glass of water before meals to help you feel fuller and eat less.",
    "Plan your meals for the week to make healthier choices and avoid impulse eating.",
    "Find a workout buddy or join a class to stay motivated and accountable."
];

const weightGainTips = [
    "Incorporate nutrient-dense snacks like nuts, seeds, and avocados into your diet.",
    "Add healthy fats to your meals, such as olive oil, nuts, and fatty fish.",
    "Eat more frequent, smaller meals throughout the day if you struggle with a low appetite.",
    "Focus on strength training exercises to build muscle mass, which contributes to healthy weight gain.",
    "Increase your protein intake with sources like eggs, dairy, and lean meats.",
    "Don't fill up on water before meals. Drink fluids after or between meals.",
    "Add calorie-rich toppings to your meals, like cheese, nuts, or seeds.",
    "Choose full-fat dairy products like whole milk and full-fat yogurt.",
    "Make a high-calorie smoothie with protein powder, fruits, and a healthy fat source like almond butter.",
    "Ensure you are eating enough carbohydrates for energy, like whole grains, potatoes, and rice.",
    "Even with a goal of weight gain, it's important to choose healthy fats. If you logged high oily food, focus on unsaturated fats.",
    "Get enough rest. Your muscles need time to recover and grow after workouts.",
    "Eat a bedtime snack, like a bowl of yogurt or a handful of almonds.",
    "Don't be afraid of carbs. They are your body's primary energy source.",
    "Be consistent with your eating and exercise routine for the best results."
];

export const getDailyTip = (userProfile: UserProfile | null, latestLog: DailyLog | null): string => {
    const goal = userProfile?.goal || "weight_loss";
    const tips = goal === "weight_loss" ? weightLossTips : weightGainTips;

    if (latestLog) {
        if (latestLog.oilyFoodPercent > 40) {
            const specificTip = tips.find(tip => tip.includes("oily food") || tip.includes("healthy fats"));
            if (specificTip) return specificTip;
        }
        if (latestLog.sugarTaken) {
            const specificTip = tips.find(tip => tip.includes("sugar"));
            if (specificTip) return specificTip;
        }
    }
    
    // Fallback to a random tip
    return tips[new Date().getDate() % tips.length];
};
