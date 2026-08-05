import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { UserGoal } from '@/lib/tips';
import { LogOut } from 'lucide-react';

const Settings = () => {
    const { user, userProfile, signOut, reloadUserProfile } = useAuth();
    const [goal, setGoal] = useState<UserGoal>('weight_loss');
    const [targetWeight, setTargetWeight] = useState<number>(0);
    const [currentWeight, setCurrentWeight] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (userProfile) {
            setGoal(userProfile.goal);
            setTargetWeight(userProfile.targetWeight);
            setCurrentWeight(userProfile.currentWeight);
        }
    }, [userProfile]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSaving(true);
        setMessage('');

        const updatedProfile = {
            goal,
            targetWeight,
            currentWeight,
        };

        try {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, updatedProfile, { merge: true });
            await reloadUserProfile(); // Refresh context
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Error saving settings: ", error);
            setMessage('Failed to save settings.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>
            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label className="block text-lg font-medium text-gray-700">Your Goal</label>
                    <div className="mt-2 flex rounded-md shadow-sm">
                        <button type="button" onClick={() => setGoal('weight_loss')}
                                className={`flex-1 px-4 py-2 rounded-l-md font-semibold ${goal === 'weight_loss' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            Weight Loss
                        </button>
                        <button type="button" onClick={() => setGoal('weight_gain')}
                                className={`flex-1 px-4 py-2 rounded-r-md font-semibold ${goal === 'weight_gain' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            Weight Gain
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="currentWeight" className="block text-lg font-medium text-gray-700">Current Weight (kg)</label>
                    <input type="number" id="currentWeight" value={currentWeight} onChange={e => setCurrentWeight(Number(e.target.value))}
                           className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <div>
                    <label htmlFor="targetWeight" className="block text-lg font-medium text-gray-700">Target Weight (kg)</label>
                    <input type="number" id="targetWeight" value={targetWeight} onChange={e => setTargetWeight(Number(e.target.value))}
                           className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                
                {message && <p className="text-center text-green-600">{message}</p>}

                <div>
                    <button type="submit" disabled={isSaving}
                            className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-md shadow-md hover:bg-blue-700 disabled:bg-gray-400">
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>

            <div className="mt-8 border-t pt-6 text-center">
                 <button onClick={signOut}
                        className="flex items-center justify-center w-full max-w-xs mx-auto px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors">
                     <LogOut className="mr-2" />
                     Sign Out
                </button>
            </div>
        </div>
    );
};

export default Settings;
