"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Cover } from "@/components/ui/cover";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ethers } from "ethers";
import { useWeb3 } from "@/components/web3-provider";
import { EventPlatform } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createHelia } from "helia";
import { json } from "@helia/json";
import { Header } from "@/components/header";
import { useTheme } from "next-themes";

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
  const [BackgroundFill, setBackgroundFill] = useState<string>("white");
  const { theme } = useTheme();

  useEffect(() => {
    // console.log(theme);
    // console.log(typeof theme);

    if (theme === "dark") {
      setBackgroundFill("black");
    } else {
      setBackgroundFill("white");
    }
  }, [theme]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      date: "",
      price: "",
      ticketSupply: "",
      isTokenGated: false,
      gateToken: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("values:", values);
    if (!provider || !address) {
      alert("Please connect your wallet");
      return;
    }

    setIsSubmitting(true);

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        EventPlatform.address,
        EventPlatform.abi,
        signer
      );

      console.log("values:", values);

      const tx = await contract.createEvent(
        values.name,
        values.description,
        Math.floor(new Date(values.date).getTime() / 1000),
        ethers.utils.parseEther(values.price),
        values.ticketSupply,
        { gasLimit: 21000 }
      );

      await tx.wait();

      alert("Event created successfully!");
      form.reset();
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WavyBackground
      backgroundFill={BackgroundFill}
      containerClassName=""
      className=" mt-96 md:mt-32"
    >
      <div className="  flex flex-col md:flex-row items-center justify-center gap-10 w-full">
        <div className=" w-1/2 ">
          <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-neutral-600 dark:to-neutral-600">
            Meet, Connect & Volenteer on the
            <Cover>Fastest Blockchain</Cover>{" "}
            <div className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-600 dark:via-neutral-400 dark:to-neutral-400">
              with EventChain{" "}
            </div>
          </h1>
        </div>
        <div className="text-black md:w-1/2 border-2 p-3 rounded-2xl  m-2 bg-gray-700 bg-opacity-50  ">
          <h1 className="text-3xl font-bold mb-6 text-center pt-2">
            Create New Event
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input className="bg-zinc-800 bg-opacity-30" {...field} />
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
                      <Input
                        type="datetime-local"
                        className="bg-zinc-800 bg-opacity-30"
                        {...field}
                      />
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
                      <Input
                        type="number"
                        className="bg-zinc-800 bg-opacity-30"
                        step="0.001"
                        {...field}
                      />
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
                      <Input
                        type="number"
                        className="bg-zinc-800 bg-opacity-30"
                        {...field}
                      />
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
                      <Textarea
                        className="bg-zinc-800 bg-opacity-30"
                        {...field}
                      />
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
              {form.watch("isTokenGated") && (
                <FormField
                  control={form.control}
                  name="gateToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gate Token Address</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-zinc-800 bg-opacity-30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="w-full flex items-center justify-center">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </WavyBackground>
  );
}
