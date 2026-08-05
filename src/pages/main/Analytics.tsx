import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { DailyLog, UserProfile } from '@/lib/tips';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { format, subDays } from 'date-fns';

type TimeFrame = 7 | 30;

const Analytics = () => {
    const { user, userProfile } = useAuth();
    const [data, setData] = useState<DailyLog[]>([]);
    const [timeFrame, setTimeFrame] = useState<TimeFrame>(7);
    const [loading, setLoading] = useState(true);
    const [correlationInsight, setCorrelationInsight] = useState('');

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                setLoading(true);
                const endDate = format(new Date(), 'yyyy-MM-dd');
                const startDate = format(subDays(new Date(), timeFrame - 1), 'yyyy-MM-dd');
                
                const logsCollection = collection(db, 'users', user.uid, 'daily_logs');
                const q = query(logsCollection, orderBy('date', 'asc'));
                
                const querySnapshot = await getDocs(q);
                const logs = querySnapshot.docs.map(doc => doc.data() as DailyLog).filter(log => log.date >= startDate && log.date <= endDate);
                setData(logs);
                setLoading(false);
            };
            fetchData();
        }
    }, [user, timeFrame]);
    
    useEffect(() => {
        if (data.length > 1) {
            setCorrelationInsight(calculateCorrelation(data, userProfile));
        } else {
            setCorrelationInsight('Not enough data to find correlations. Keep logging!');
        }
    }, [data, userProfile]);

    const calculateCorrelation = (logs: DailyLog[], profile: UserProfile | null): string => {
        if (!profile) return '';

        const weightChanges = logs.slice(1).map((log, i) => log.weightKg - logs[i].weightKg);
        const avgSteps = logs.map(l => l.steps).reduce((a, b) => a + b, 0) / logs.length;
        const avgOilyFood = logs.map(l => l.oilyFoodPercent).reduce((a, b) => a + b, 0) / logs.length;

        let scoreSteps = 0;
        let scoreOily = 0;

        weightChanges.forEach((change, i) => {
            const stepChange = logs[i+1].steps > avgSteps;
            const oilyChange = logs[i+1].oilyFoodPercent < avgOilyFood;

            if (profile.goal === 'weight_loss') {
                if (change < 0) { // Weight loss
                    if (stepChange) scoreSteps++;
                    if (oilyChange) scoreOily++;
                }
            } else { // Weight gain
                if (change > 0) { // Weight gain
                    if (!stepChange) scoreSteps++; // Less steps might mean less cardio
                    if (!oilyChange) scoreOily++; // This is tricky, but let's assume higher intake helps
                }
            }
        });

        if (scoreSteps > scoreOily) {
            return `Higher step counts seem to be positively impacting your ${profile.goal.replace('_', ' ')} goal. Keep it up!`;
        } else if (scoreOily > scoreSteps) {
            return `Managing your oily food intake appears to be a key factor for your ${profile.goal.replace('_', ' ')} progress.`;
        }
        return "Your progress seems steady. Let's gather more data to find clear correlations.";
    };


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Your Analytics</h1>
            <div className="flex justify-center space-x-2">
                <button onClick={() => setTimeFrame(7)} className={`px-4 py-2 rounded-md font-semibold ${timeFrame === 7 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>7 Days</button>
                <button onClick={() => setTimeFrame(30)} className={`px-4 py-2 rounded-md font-semibold ${timeFrame === 30 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>30 Days</button>
            </div>
            
            {/* Chart */}
            <div className="bg-white p-2 md:p-6 rounded-lg shadow-md h-96">
                {loading ? <div className="text-center p-10">Loading chart...</div> :
                 data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={(tick) => format(new Date(tick), 'MMM d')} />
                            <YAxis yAxisId="left" label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                            <YAxis yAxisId="right" orientation="right" label={{ value: 'Steps / Oil %', angle: 90, position: 'insideRight' }}/>
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="weightKg" stroke="#8884d8" strokeWidth={2} name="Weight (kg)" />
                            <Line yAxisId="right" type="monotone" dataKey="steps" stroke="#82ca9d" name="Steps" />
                            <Line yAxisId="right" type="monotone" dataKey="oilyFoodPercent" stroke="#ffc658" name="Oily Food %" />
                        </LineChart>
                    </ResponsiveContainer>
                 ) : (
                    <p className="text-center p-10 text-gray-600">No data available for this period. Start logging to see your progress!</p>
                 )
                }
            </div>

            {/* Correlation Insight */}
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md">
                 <p className="font-bold">Correlation Insight</p>
                 <p>{correlationInsight}</p>
            </div>
        </div>
    );
};

export default Analytics;
