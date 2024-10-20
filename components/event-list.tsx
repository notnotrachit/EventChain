"use client";
import { useState, useEffect, SetStateAction } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "./web3-provider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { EventPlatform } from "@/lib/contracts";
import { BorderBeam } from "./ui/border-beam";
import ShineBorder from "./ui/shine-border";
import { BackgroundGradient } from "./ui/background-gradient";

export const fetchEvents = async (
  provider: ethers.Signer | ethers.providers.Provider | null | undefined,
  setLoading: React.Dispatch<SetStateAction<boolean>>,
  setEvents: any
) => {
  setLoading(true);
  console.log("Fetching events");
  try {
    if (provider) {
      const contract = new ethers.Contract(
        EventPlatform.address,
        EventPlatform.abi,
        provider
      );
      const eventCount = await contract.getEventCount();
      const fetchedEvents = [];
      console.log("Event count:", eventCount);

      for (let i = 0; i < eventCount; i++) {
        const event = await contract.events(i);
        fetchedEvents.push({
          id: i,
          ...event,
        });
      }
      console.log("Fetched events:", fetchedEvents);
      setEvents(fetchedEvents);
    }
  } catch (error) {
    console.error("Failed to fetch events:", error);
  } finally {
    setLoading(false);
  }
};

export function EventList() {
  const { provider } = useWeb3();
  const [events, setEvents] = useState<
    {
      id: number;
      name: string;
      description: string;
      date: string;
      ticketPrice: string;
      maxTickets: number;
      ticketsSold: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const buyTickets = async (eventId: any, quantity: number) => {
    console.log("Buying tickets", eventId, quantity);
    try {
      const signer = provider?.getSigner();
      const contract = new ethers.Contract(
        EventPlatform.address,
        EventPlatform.abi,
        signer
      );
      const tx = await contract.buyTickets(eventId, quantity);
      await tx.wait();
      console.log("Transaction:", tx);
      // Refetch events to update the UI
      fetchEvents(provider, setLoading, setEvents);
    } catch (error) {
      console.error("Failed to buy tickets:", error);
    }
  };

  return (
    <div id="Event" className=" container px-4 pb-8 ">
      {/* <BorderBeam size={250} duration={12} delay={9} /> */}

      <ShineBorder
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        className=" w-full flex flex-row  justify-evenly  items-center overflow-hidden mb-6 border-2 p-2 rounded-xl"
      >
        <h1 className="text-2xl font-bold ">Event List</h1>
        <Button
          onClick={() => fetchEvents(provider, setLoading, setEvents)}
          disabled={loading}
          className="z-20"
        >
          {loading ? "Fetching..." : "Fetch Events"}
        </Button>
      </ShineBorder>

      {loading ? (
        <p className="text-center">Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <BackgroundGradient
              className="rounded-2xl  sm:p-1 bg-white dark:bg-zinc-900"
              key={event.id}
            >
              <Card key={event.id} className="flex flex-col rounded-2xl">
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="mb-2">{event.description}</p>
                  <p className="mb-2">
                    <strong>Date:</strong>{" "}
                    {new Date(parseInt(event.date) * 1000).toLocaleString()}
                  </p>
                  <p className="mb-2">
                    <strong>Price:</strong>{" "}
                    {ethers.utils.formatEther(event.ticketPrice)} ETH
                  </p>
                  <p>
                    <strong>Tickets Available:</strong>{" "}
                    {event.maxTickets - event.ticketsSold}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => buyTickets(event.id, 1)}
                    disabled={event.maxTickets - event.ticketsSold === 0}
                    className="w-full"
                  >
                    {event.maxTickets - event.ticketsSold === 0
                      ? "Sold Out"
                      : "Buy Ticket"}
                  </Button>
                </CardFooter>
              </Card>
            </BackgroundGradient>
          ))}
        </div>
      )}

      {!loading && events.length === 0 && (
        <p className="text-center">
          No events found. Try fetching events or create a new one! (Please
          login before fetching )
        </p>
      )}
    </div>
  );
}
