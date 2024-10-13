"use client";
import { useState, useEffect } from "react";
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

export function EventList() {
  const { provider } = useWeb3();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    console.log("Fetching events");
    try {
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
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const buyTickets = async (eventId, quantity) => {
    console.log("Buying tickets", eventId, quantity);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        EventPlatform.address,
        EventPlatform.abi,
        signer
      );
      const tx = await contract.buyTickets(eventId, quantity);
      await tx.wait();
      console.log("Transaction:", tx);
      // Refetch events to update the UI
      fetchEvents();
    } catch (error) {
      console.error("Failed to buy tickets:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event List</h1>
        <Button onClick={fetchEvents} disabled={loading}>
          {loading ? "Fetching..." : "Fetch Events"}
        </Button>
      </div>

      {loading ? (
        <p className="text-center">Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col">
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
          ))}
        </div>
      )}

      {!loading && events.length === 0 && (
        <p className="text-center">
          No events found. Try fetching events or create a new one!
        </p>
      )}
    </div>
  );
}
