import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import type { Activity, EmissionCategory } from '@/types';

type ActivityLog = {
    category: EmissionCategory;
    emissions: number;
    description: string;
    date: string; // ISO String
}

// Function to add a new activity log for a user
export const addActivityLog = async (userId: string, activityData: ActivityLog) => {
    try {
        const userActivitiesCol = collection(db, 'users', userId, 'activities');
        await addDoc(userActivitiesCol, {
            ...activityData,
            date: Timestamp.fromDate(new Date(activityData.date)), // Store as Firestore Timestamp
        });
    } catch (error) {
        console.error("Error adding document: ", error);
        throw new Error("Could not save activity.");
    }
};

// Function to get all activities for a user within a date range
export const getActivitiesForDateRange = async (userId: string, startDate: Date, endDate: Date): Promise<Activity[]> => {
    try {
        const userActivitiesCol = collection(db, 'users', userId, 'activities');
        const q = query(
            userActivitiesCol,
            where('date', '>=', Timestamp.fromDate(startDate)),
            where('date', '<=', Timestamp.fromDate(endDate)),
            orderBy('date', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const activities: Activity[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            activities.push({
                id: doc.id,
                ...data,
                date: (data.date as Timestamp).toDate().toISOString(),
            } as Activity);
        });
        return activities;
    } catch (error) {
        console.error("Error getting documents: ", error);
        throw new Error("Could not retrieve activities.");
    }
}

// Function to get today's activities
export const getTodaysActivities = async (userId: string): Promise<Activity[]> => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return getActivitiesForDateRange(userId, todayStart, todayEnd);
}
