"use client"

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './web3-provider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { EventPlatform } from '@/lib/contracts';

export function EventList() {
  const { provider } = useWeb3();
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    console.log("fetching events");
    try {
      const contract = new ethers.Contract(EventPlatform.address, EventPlatform.abi, provider);
      const eventCount = await contract.getEventCount();
      const fetchedEvents = [];
      console.log("eventCount", eventCount);

      for (let i = 0; i < eventCount; i++) {
        const event = await contract.events(i);
        fetchedEvents.push({
          id: i,
          ...event,
        });
      }
      console.log("fetchedEvents", fetchedEvents);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };


  const buyTickets = async (eventId, quantity) => {
    console.log("buying tickets", eventId, quantity);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(EventPlatform.address, EventPlatform.abi, signer);
      const tx = await contract.buyTickets(eventId, quantity);
      await tx.wait();
      console.log("tx", tx);
    } catch (error) {
      console.error("Failed to buy tickets:", error
      );
    }
  }



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Button onClick={fetchEvents}>Fetch Events</Button>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <h2>{event.name}</h2>
            <p>{event.description}</p>
            <p>
              Date: {new Date(parseInt(event.date) * 1000).toLocaleString()}
            </p>
            <p>Price: {ethers.utils.formatEther(event.ticketPrice)} ETH</p>
            <p>Tickets Available: {event.maxTickets - event.ticketsSold}</p>
            <button onClick={
              () => buyTickets(event.id, 1)
            }>Buy Tickets</button>
          </li>
        ))}
      </ul>
    </div>
  );
}