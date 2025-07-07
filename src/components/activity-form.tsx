'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
  Footprints,
  Utensils,
  Bolt,
  ShoppingCart,
} from 'lucide-react';

const formSchema = z.object({
  category: z.enum(['Travel', 'Food', 'Energy', 'Shopping'], {
    required_error: 'Please select a category.',
  }),
  description: z.string().min(2, {
    message: 'Description must be at least 2 characters.',
  }),
  amount: z.number().min(0).max(100),
});

const categoryIcons = {
  Travel: <Footprints className="mr-2 h-4 w-4" />,
  Food: <Utensils className="mr-2 h-4 w-4" />,
  Energy: <Bolt className="mr-2 h-4 w-4" />,
  Shopping: <ShoppingCart className="mr-2 h-4 w-4" />,
};

export function ActivityForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: undefined,
      description: '',
      amount: 50,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Activity Logged!',
      description: `Your ${values.category.toLowerCase()} activity has been saved.`,
      variant: 'default',
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(categoryIcons).map(([category, icon]) => (
                     <SelectItem key={category} value={category}>
                        <div className="flex items-center">
                          {icon}
                          {category}
                        </div>
                     </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Drove to work" {...field} />
              </FormControl>
              <FormDescription>
                Briefly describe the activity.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Amount / Intensity</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Slider
                    defaultValue={[value]}
                    max={100}
                    step={1}
                    onValueChange={(vals) => onChange(vals[0])}
                    className="w-full"
                  />
                   <span className="text-sm font-medium w-12 text-center">{value}</span>
                </div>
              </FormControl>
              <FormDescription>
                Adjust the slider based on the scale of the activity (e.g., distance, cost, consumption).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto">Log Activity</Button>
      </form>
    </Form>
  );
}
