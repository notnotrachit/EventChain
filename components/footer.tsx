"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FaGithub } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { SiFarcaster } from "react-icons/si";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import Link from "next/link";

const Footer = () => {
  const people = [
    {
      id: 1,
      name: "Yash",
      designation: "FullStack Dev",
      image:
        "https://avatars.githubusercontent.com/u/114144836?s=400&u=b6e489363b59e9cb5e6bff71f1c86b1e503c355e&v=4",
    },
    {
      id: 2,
      name: "Rachit",
      designation: "FullStack Dev",
      image: "https://avatars.githubusercontent.com/u/70265590?v=4",
    },
  ];

  return (
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <BackgroundBeams />
      <div className="flex-row md:flex items-center justify-center gap-6 ">
        <div className="flex-row pb-6 md:pb-0 border-b md:border-b-0 md:border-r ">
          <div className="max-w-2xl flex gap-8 justify-center ">
            {/* <h1 className="relative z-10 text-lg md:text-6xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Have Query ?
        </h1>

        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-2xl text-center relative z-10">
          Mail us at Yashraj.se10@gmail.com
        </p> */}
            <Link href={"https://github.com/yash-raj10/EventChain"}>
              {" "}
              <FaGithub color="white" size={60} />
            </Link>

            <FaSquareXTwitter color="white" size={60} />
            <SiFarcaster color="white" size={60} />
          </div>

          <div className="max-w-2xl  mx-auto p-4 pb-0">
            <h1 className="relative z-10 text-lg md:text-5xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
              Have Query ?
            </h1>

            <p className="text-neutral-500 max-w-lg mx-auto mt-2 text-xl text-center relative z-10">
              Mail us at Yashraj.se10@gmail.com
            </p>
          </div>
        </div>

        <div className="pt-6 md:pt-0">
          <div className="flex flex-row items-center justify-center mb-4 w-full">
            <AnimatedTooltip items={people} />
          </div>
          <p className="text-neutral-500 text-base text-center ">
            Made by Us with ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
