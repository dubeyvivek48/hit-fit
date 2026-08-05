import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { DailyLog } from '@/lib/tips';
import { format } from 'date-fns';

const AddEntry = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [weightKg, setWeightKg] = useState<number>(0);
    const [steps, setSteps] = useState<number>(0);
    const [sugarTaken, setSugarTaken] = useState<boolean>(false);
    const [oilyFoodPercent, setOilyFoodPercent] = useState<number>(20);
    const [dailySummary, setDailySummary] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmitting(true);

        const today = format(new Date(), 'yyyy-MM-dd');
        const newLog: DailyLog = {
            date: today,
            weightKg,
            steps,
            sugarTaken,
            oilyFoodPercent,
            dailySummary,
            createdAt: new Date().toISOString(),
        };

        try {
            const logDocRef = doc(db, 'users', user.uid, 'daily_logs', today);
            await setDoc(logDocRef, newLog, { merge: true }); // Use merge to update if entry for today exists
            navigate('/');
        } catch (error) {
            console.error("Error adding document: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Add Daily Log</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="weightKg" className="block text-lg font-medium text-gray-700">Weight (kg)</label>
                    <input type="number" id="weightKg" value={weightKg} onChange={e => setWeightKg(Number(e.target.value))}
                           className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label htmlFor="steps" className="block text-lg font-medium text-gray-700">Steps</label>
                    <input type="number" id="steps" value={steps} onChange={e => setSteps(Number(e.target.value))}
                           className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-700">Had Sugar Today?</span>
                    <button type="button" onClick={() => setSugarTaken(!sugarTaken)}
                            className={`px-4 py-2 rounded-md font-semibold ${sugarTaken ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                        {sugarTaken ? 'Yes' : 'No'}
                    </button>
                </div>
                <div>
                    <label htmlFor="oilyFood" className="block text-lg font-medium text-gray-700">Oily Food % ({oilyFoodPercent}%)</label>
                    <input type="range" id="oilyFood" min="0" max="100" value={oilyFoodPercent} onChange={e => setOilyFoodPercent(Number(e.target.value))}
                           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"/>
                </div>
                <div>
                    <label htmlFor="summary" className="block text-lg font-medium text-gray-700">Daily Summary</label>
                    <textarea id="summary" value={dailySummary} onChange={e => setDailySummary(e.target.value)} rows={3}
                              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <button type="submit" disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-md shadow-md hover:bg-blue-700 disabled:bg-gray-400">
                        {isSubmitting ? 'Saving...' : 'Save Log'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEntry;
