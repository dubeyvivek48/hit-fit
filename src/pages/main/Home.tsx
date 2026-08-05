import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { DailyLog, getDailyTip, UserProfile } from '@/lib/tips';
import { Lightbulb } from 'lucide-react';

const Home = () => {
    const { user, userProfile } = useAuth();
    const [latestLog, setLatestLog] = useState<DailyLog | null>(null);
    const [tip, setTip] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && userProfile) {
            const fetchLatestLog = async () => {
                setLoading(true);
                const logsCollection = collection(db, 'users', user.uid, 'daily_logs');
                const q = query(logsCollection, orderBy('date', 'desc'), limit(1));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const logData = querySnapshot.docs[0].data() as DailyLog;
                    setLatestLog(logData);
                }
                setLoading(false);
            };

            fetchLatestLog();
        }
    }, [user, userProfile]);

    useEffect(() => {
        setTip(getDailyTip(userProfile, latestLog));
    }, [userProfile, latestLog]);


    if (loading) {
        return <div className="text-center p-10">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome, {user?.displayName?.split(' ')[0]}!</h1>
            
            {/* Daily Tip Banner */}
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-md flex items-start">
                <Lightbulb className="h-6 w-6 mr-3 flex-shrink-0" />
                <div>
                    <p className="font-bold">Daily Tip</p>
                    <p>{tip}</p>
                </div>
            </div>

            {/* Latest Entry Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Your Last Log</h2>
                {latestLog ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Weight</span>
                            <span className="text-xl font-semibold">{latestLog.weightKg} kg</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Steps</span>
                            <span className="text-xl font-semibold">{latestLog.steps}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Sugar</span>
                            <span className={`text-xl font-semibold ${latestLog.sugarTaken ? 'text-red-500' : 'text-green-500'}`}>
                                {latestLog.sugarTaken ? 'Yes' : 'No'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Oily Food</span>
                            <span className="text-xl font-semibold">{latestLog.oilyFoodPercent}%</span>
                        </div>
                        <div className="col-span-2 mt-2">
                             <span className="text-sm text-gray-500">Summary</span>
                            <p className="text-gray-700 mt-1 italic">"{latestLog.dailySummary}"</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">No logs yet. Add your first entry to get started!</p>
                )}
            </div>
        </div>
    );
};

export default Home;
