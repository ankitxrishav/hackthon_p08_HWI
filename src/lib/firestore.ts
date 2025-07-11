import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import type { Activity, EmissionCategory, UserProfile } from '@/types';

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

// Function to delete an activity log
export const deleteActivityLog = async (userId: string, activityId: string) => {
    try {
        const activityRef = doc(db, 'users', userId, 'activities', activityId);
        await deleteDoc(activityRef);
    } catch (error) {
        console.error("Error deleting document: ", error);
        throw new Error("Could not delete activity.");
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
        // Re-throw the original error object to preserve its code (e.g., 'permission-denied')
        // for specific handling in the UI components.
        throw error;
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

// Function to get the complete activity history for a user
export const getActivityHistory = async (userId: string): Promise<Activity[]> => {
    try {
        const userActivitiesCol = collection(db, 'users', userId, 'activities');
        const q = query(userActivitiesCol, orderBy('date', 'desc'));

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
        console.error("Error getting activity history: ", error);
        throw error;
    }
};


// New User Profile functions
export const setUserProfile = async (userId: string, profileData: Omit<UserProfile, 'id'>) => {
    try {
        const profileWithTimestamp = {
            ...profileData,
            updatedAt: new Date().toISOString(),
        };

        // Set the main, current profile
        const profileRef = doc(db, 'users', userId, 'profile', 'main');
        await setDoc(profileRef, profileWithTimestamp);

        // Add to history
        const historyColRef = collection(db, 'users', userId, 'profile_history');
        await addDoc(historyColRef, profileWithTimestamp);

    } catch (error) {
        console.error("Error setting user profile: ", error);
        throw new Error("Could not save user profile.");
    }
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const profileRef = doc(db, 'users', userId, 'profile', 'main');
        const docSnap = await getDoc(profileRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as UserProfile;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting user profile: ", error);
        // Return null instead of throwing an error to make the app more resilient to network issues.
        // The calling component will handle the null case.
        return null;
    }
}

export const getProfileHistory = async (userId: string): Promise<UserProfile[]> => {
    try {
        const historyColRef = collection(db, 'users', userId, 'profile_history');
        const q = query(historyColRef, orderBy('updatedAt', 'desc'));

        const querySnapshot = await getDocs(q);
        const history: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
            history.push({ id: doc.id, ...doc.data() } as UserProfile);
        });
        return history;
    } catch (error) {
        console.error("Error getting profile history: ", error);
        return []; // Return empty array on error to prevent UI crash
    }
}
