"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ethers } from 'ethers';
import { useWeb3 } from '@/components/web3-provider';
import { EventPlatform } from '@/lib/contracts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EventDetails() {
  const { id } = useParams();
  const { provider, address } = useWeb3();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (provider && id) {
      fetchEventDetails();
    }
  }, [provider, id]);

  const fetchEventDetails = async () => {
    try {
      const contract = new ethers.Contract(EventPlatform.address, EventPlatform.abi, provider);
      const eventData = await contract.getEvent(id);
      setEvent(eventData);
    } catch (error) {
      console.error("Failed to fetch event details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseTicket = async () => {
    if (!provider || !address) {
      alert('Please connect your wallet');
      return;
    }

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(EventPlatform.address, EventPlatform.abi, signer);
      const tx = await contract.purchaseTicket(id, { value: event.price });
      await tx.wait();
      alert('Ticket purchased successfully!');
      fetchEventDetails(); // Refresh event details
    } catch (error) {
      console.error("Failed to purchase ticket:", error);
      alert('Failed to purchase ticket. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Date: {new Date(event.date * 1000).toLocaleString()}</p>
          <p>Price: {ethers.utils.formatEther(event.price)} ETH</p>
          <p>Tickets Available: {event.ticketSupply - event.ticketsSold} / {event.ticketSupply}</p>
          <p>Organizer: {event.organizer}</p>
          {event.isTokenGated && (
            <p>Token Gated: Requires {event.gateToken} token to purchase</p>
          )}
          <Button onClick={purchaseTicket} className="mt-4">Purchase Ticket</Button>
        </CardContent>
      </Card>
    </div>
  );
}