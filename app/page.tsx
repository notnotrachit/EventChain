import { EventList } from "@/components/event-list";
import { Globee } from "@/components/globee";
import { Header } from "@/components/header";
import { BackgroundLines } from "@/components/ui/background-lines";
import { BorderBeam } from "@/components/ui/border-beam";
import { Global } from "recharts";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent">
      <main className="container mx-auto px-4 pt-8">
        <BackgroundLines
          children={undefined}
          className={undefined}
          svgOptions={undefined}
        />

        <Globee />

        <div className=" ">
          {" "}
          <h1 className=" font-bold flex- mb-5 text-black dark:text-white  flex items-center mt-14 ">
            <div className="border-t border-4 border-gray-400 flex-grow"></div>
            <div className="px-3 text-gray-800 font-bold text-4xl">
              Upcoming Events
            </div>
            <div className="border-t border-4 border-gray-400 flex-grow"></div>
          </h1>
          <EventList />
        </div>
      </main>
    </div>
  );
}
