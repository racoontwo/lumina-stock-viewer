
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStockStore } from '@/store/stockStore';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Stock } from '@/types/Stock';

const stockSchema = z.object({
  ticker: z.string()
    .min(1, { message: 'Ticker is required' })
    .max(5, { message: 'Ticker should not exceed 5 characters' })
    .toUpperCase(),
  date: z.string()
    .min(1, { message: 'Date is required' }),
  type: z.enum(['BO', 'EP', 'IPO', 'SPAC', 'OTHER'], {
    required_error: 'Please select a stock type',
  })
});

type FormData = z.infer<typeof stockSchema>;

const AddStockForm: React.FC = () => {
  const { addStock } = useStockStore();

  const form = useForm<FormData>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      ticker: '',
      date: new Date().toISOString().split('T')[0], // Today's date
      type: 'BO'
    }
  });

  const onSubmit = (data: FormData) => {
    addStock(data as Omit<Stock, 'id'>);
    form.reset({
      ticker: '',
      date: new Date().toISOString().split('T')[0],
      type: 'BO'
    });
  };

  return (
    <div className="p-6 rounded-lg border border-neonPink border-opacity-30 bg-darkBg2 bg-opacity-50">
      <h2 className="text-xl font-bold mb-4 neon-text-pink">Add New Stock</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="ticker"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Ticker</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="AAPL"
                      className="border-neonBlue border-opacity-30 bg-darkBg focus:border-neonPink"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="border-neonBlue border-opacity-30 bg-darkBg focus:border-neonPink"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-neonBlue border-opacity-30 bg-darkBg focus:border-neonPink">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-darkBg border-neonBlue">
                      <SelectItem value="BO">BO</SelectItem>
                      <SelectItem value="EP">EP</SelectItem>
                      <SelectItem value="IPO">IPO</SelectItem>
                      <SelectItem value="SPAC">SPAC</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="bg-neonPink hover:bg-neonPink/70 text-white mt-2 w-full md:w-auto"
          >
            Add Stock
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddStockForm;
