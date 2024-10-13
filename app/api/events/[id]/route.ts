import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { EventPlatform } from '@/lib/contracts';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC_URL);
    const contract = new ethers.Contract(EventPlatform.address, EventPlatform.abi, provider);

    const event = await contract.getEvent(params.id);

    return NextResponse.json({
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
  } catch (error) {
    console.error('Failed to fetch event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}