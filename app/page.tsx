import { EventList } from "@/components/event-list";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Upcoming Events</h1>
        <EventList />
      </main>
    </div>
  );
}