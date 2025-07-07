'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getActivityHistory, deleteActivityLog } from '@/lib/firestore';
import type { Activity } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, History, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const HistorySkeleton = () => (
    <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
        <Card key={i}>
        <CardContent className="p-4 flex justify-between items-center">
            <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-10 w-10" />
        </CardContent>
        </Card>
    ))}
    </div>
);

export default function HistoryPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
        const history = await getActivityHistory(user.uid);
        setActivities(history);
    } catch (err: any) {
        setError("Could not load your activity history. Please try again later.");
    } finally {
        setIsLoading(false);
    }
    };

    useEffect(() => {
    fetchHistory();
    }, [user]);

    const handleDelete = async (activityId: string) => {
    if (!user) return;
    try {
        await deleteActivityLog(user.uid, activityId);
        toast({
        title: 'Success!',
        description: 'Activity has been deleted.',
        });
        // Refetch history and notify dashboard
        fetchHistory();
        window.dispatchEvent(new CustomEvent('activityDeleted'));
    } catch (error) {
        toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete activity.',
        });
    }
    };

    return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <History /> Activity History
            </CardTitle>
            <CardDescription>
            Here is a complete log of your recorded activities. You can remove entries if they were added by mistake.
            </CardDescription>
        </CardHeader>
        </Card>

        {isLoading ? (
        <HistorySkeleton />
        ) : error ? (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
        ) : activities.length === 0 ? (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                You haven't logged any activities yet.
            </CardContent>
        </Card>
        ) : (
        <div className="space-y-4">
            {activities.map((activity) => (
            <Card key={activity.id}>
                <CardContent className="p-4 flex justify-between items-center">
                <div className="flex-1">
                    <p className="font-semibold">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                    {format(new Date(activity.date), 'PPP p')} • <span className="font-medium text-foreground">{activity.emissions} kg CO₂e</span>
                    </p>
                </div>
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="size-5" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this activity log from your history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(activity.id)} className="bg-destructive hover:bg-destructive/90">
                        Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </CardContent>
            </Card>
            ))}
        </div>
        )}
    </div>
    );
}
