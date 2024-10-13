"use client"

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/components/web3-provider';
import { EventPlatform } from '@/lib/contracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';

export default function Dashboard() {
  const { provider, address } = useWeb3();
  const [userEvents, setUserEvents] = useState([]);
  const [userTickets, setUserTickets] = useState([]);

  useEffect(() => {
    if (provider && address) {
      fetchUserEvents();
      fetchUserTickets();
    }
  }, [provider, address]);
  

  // fetch events when user connects wallet
  

  const fetchUserEvents = async () => {
    console.log("fetching user events");
    try {
      const contract = new ethers.Contract(EventPlatform.address, EventPlatform.abi, provider);
      const eventCount = await contract.getEventCount();
      // console.log("eventCount", eventCount);
      const events = [];

      for (let i = 0; i < eventCount; i++) {
        const event = await contract.events(i);
        console.log(event)
        if (event[0].toLowerCase() === address.toLowerCase()) {
          events.push(event);
        }
      }

      setUserEvents(events);
    } catch (error) {
      console.error("Failed to fetch user events:", error);
    }
  };

  const fetchUserTickets = async () => {
    console.log("fetching user tickets");
    try {
      const contract = new ethers.Contract(EventPlatform.address, EventPlatform.abi, provider);
      const eventCount = await contract.getEventCount();
      console.log("eventCount", eventCount);
      const tickets = [];
      for (let i = 0; i < eventCount; i++) {
        const event = await contract.events(i);
        const tickets = await contract.getTicketsOwned(i);
        console.log("tickets", tickets);

        // setUserTickets(tickets);
      }
    } catch (error) {
      console.error("Failed to fetch user tickets:", error);
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Events</h2>
          <button onClick={fetchUserEvents}>Refresh</button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userEvents.map((event) => (
              <Card key="123">
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Date: {new Date(event.date * 1000).toLocaleString()}</p>
                  <p>
                    Tickets Sold: {parseInt(event.ticketsSold._hex)}/
                    {parseInt(event.maxTickets._hex)}
                  </p>
                  <Button className="mt-2">Manage Event</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Tickets</h2>
          <button onClick={fetchUserTickets}>Refresh</button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader>
                  <CardTitle>{ticket.event.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Date: {new Date(ticket.event.date * 1000).toLocaleString()}
                  </p>
                  <p>Ticket ID: {ticket.id.toString()}</p>
                  <Button className="mt-2">View Ticket</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}