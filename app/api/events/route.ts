import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { EventPlatform } from '@/lib/contracts';

export async function GET() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC_URL);
    const contract = new ethers.Contract(EventPlatform.address, EventPlatform.abi, provider);

    const eventCount = await contract.getEventCount();
    const events = [];

    for (let i = 1; i <= eventCount; i++) {
      const event = await contract.getEvent(i);
      events.push({
        id: event.id.toString(),
        name: event.name,
        date: event.date.toString(),
        price: ethers.utils.formatEther(event.price),
        ticketSupply: event.ticketSupply.toString(),
        ticketsSold: event.ticketsSold.toString(),
        organizer: event.organizer,
        isTokenGated: event.isTokenGated,
        gateToken: event.gateToken,
      });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}