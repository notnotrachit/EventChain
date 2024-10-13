"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ethers } from 'ethers';
import { useWeb3 } from '@/components/web3-provider';
import { EventPlatform } from '@/lib/contracts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createHelia } from "helia";
import { json } from "@helia/json";
import { Header } from '@/components/header';


const formSchema = z.object({
  name: z.string().min(2).max(100),
  date: z.string(),
  price: z.string(),
  ticketSupply: z.string(),
  description: z.string(),
  isTokenGated: z.boolean(),
  gateToken: z.string().optional(),
});

export default function CreateEvent() {
  const { provider, address } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      date: '',
      price: '',
      ticketSupply: '',
      isTokenGated: false,
      gateToken: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('values:', values);
    if (!provider || !address) {
      alert('Please connect your wallet');
      return;
    }

    setIsSubmitting(true);

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(EventPlatform.address, EventPlatform.abi, signer);

      console.log('values:', values);

      const tx = await contract.createEvent(
        values.name,
        values.description,
        Math.floor(new Date(values.date).getTime() / 1000),
        ethers.utils.parseEther(values.price),
        values.ticketSupply,
        { gasLimit: 21000 }
      );

      await tx.wait();

      alert('Event created successfully!');
      form.reset();
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Price (ETH)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ticketSupply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Supply</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTokenGated"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Token Gated Event</FormLabel>
                    <FormDescription>
                      Require a specific token for ticket purchase
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {form.watch('isTokenGated') && (
              <FormField
                control={form.control}
                name="gateToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gate Token Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}