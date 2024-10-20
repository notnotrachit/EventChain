"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@/components/web3-provider";
import { EventPlatform } from "@/lib/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { parse } from "path";

export default function Dashboard() {
  const { provider, address } = useWeb3();
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [userTickets, setUserTickets] = useState<{ event: any; id: number; count: number }[]>([]);

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
      if (provider){
        const contract = new ethers.Contract(
          EventPlatform.address,
          EventPlatform.abi,
          provider
        );
        const eventCount = await contract.getEventCount();
        // console.log("eventCount", eventCount);
        const events = [];

        for (let i = 0; i < eventCount; i++) {
          const event = await contract.events(i);
          console.log(event);
          if (address && event[0].toLowerCase() === address.toLowerCase()) {
            events.push(event);
          }
        }

        setUserEvents(events);
      }
    } catch (error) {
      console.error("Failed to fetch user events:", error);
    }
  };

  const fetchUserTickets = async () => {
    console.log("fetching user tickets");
    try {
      if (provider){
      const contract = new ethers.Contract(
        EventPlatform.address,
        EventPlatform.abi,
        provider
      );
      const eventCount = await contract.getEventCount();
      console.log("eventCount", eventCount);
      const etickets = [];
      for (let i = 0; i < eventCount; i++) {
        const event = await contract.events(i);
        const tickets = await contract.getTicketsOwnedByAccount(address, i);
        if (parseInt(tickets._hex) > 0) {
          etickets.push({
            event: event,
            id: i,
            count: parseInt(tickets._hex),
          });
        }

        
        setUserTickets(etickets);
      }
    }
    } catch (error) {
      console.error("Failed to fetch user tickets:", error);
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4 pt-28">
        <h1 className=" font-bold flex- mb-5 text-black dark:text-white  flex items-center  ">
          <div className="border-t border-4 border-gray-400 flex-grow"></div>
          <div className="px-3 text-gray-800 font-bold text-4xl">Dashboard</div>
          <div className="border-t border-4 border-gray-400 flex-grow"></div>
        </h1>

        {userEvents.length != 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4  ">Your Events</h2>
            <button
              className="border-2 p-1 px-2 rounded-lg bg-gray-500 bg-opacity-70"
              onClick={fetchUserEvents}
            >
              Refresh
            </button>
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
                    {/* <Button className="mt-2">Manage Event</Button> */}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-4 ">Your Tickets</h2>
          <button
            className="border-2 p-1 px-2 rounded-lg bg-gray-500 bg-opacity-70"
            onClick={fetchUserTickets}
          >
            Refresh
          </button>
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
                  <p>Number of Tickers: {ticket.count.toString()}</p>
                  {/* <Button className="mt-2">View QR</Button> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
