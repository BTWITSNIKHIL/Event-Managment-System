import React from "react";
import bg from "../assets/bg.jpg";
import eventbg2 from "../assets/eventbg2.jpg"
import eventbg1 from "../assets/eventbg1.jpg"

const EventsSection = () => {
  return (
    <div className="min-h-screen font-roboto bg-white p-8 text-center">
      <h1 className="text-4xl font-extrabold text-black text-center mb-8 py-3">
        College Events 2025
      </h1>
      <div className="background mx-40 bg-gray-100 my-6 shadow-xl">
        {/* First Row */}
        <div className="flex w-full h-[300px] ">
          <div className="w-1/2 h-full overflow-hidden">
            <img src={eventbg1} className=" hover:scale-105 w-full h-full object-cover transition-transform duration-300" />
          </div>
          <div className="w-1/2 h-full flex items-center justify-center">
            <p className="text-lg font-semibold">Tech Fest 2025 - Exciting Tech Talks!</p>
          </div>
        </div>
        {/* Second Row */}
        <div className="flex w-full h-[300px] ">
          <div className="w-1/2 h-full flex flex-col items-center  px-10 py-14 ">
          <h1 className="text-2xl font-semibold">Aarohan 2025</h1>
          <p className="text-md py-4">Cultural Night - Dance, Music & More!Cultural Night - Dance, Music & More!Cultural Night - Dance, Music & More!Cultural Night - Dance, Music & More!</p>
          </div>
          <div className="w-1/2 h-full overflow-hidden">
            <img src={eventbg2} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsSection;
