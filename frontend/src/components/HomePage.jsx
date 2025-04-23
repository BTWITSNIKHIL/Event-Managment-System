import { useState } from "react";
import EventsSection from "./EventsSection"
import AboutUsSection from "./AboutUsSection";
import Footer from "./Footer";
import GallerySection from "./GallerySection";

import { Link } from "react-router";
import Homebg from "../assets/homebg.jpg"
import bg from "../assets/bg.jpg"



export default function HomePage() {
  return (
    // min-h-screen
    <div className=" bg-gray-100">
      {/* <Navbar /> */}
      <HeroSection />
      <EventsSection />
      <GallerySection />
      <AboutUsSection />
      <Footer />
    </div>
  );
}



// 📌 Hero Section
function HeroSection() {
  
    // <section className="text-center py-16 bg-white text-Black h-screen">
    //   <h1 className="text-4xl font-bold">Welcome to SyncUp</h1>
    //   <p className="mt-4 text-lg">Stay updated with all college events and activities.</p>
    //   <button className="mt-6 px-6 py-3 bg-[#755df6] text-white rounded-lg font-semibold hover:bg-[#5337f2] ">
    //     Explore Events
    //   </button>
    // </section>
    // <section>
    //   <div className="homelogo">
    //     <img src={Homelogo} className="w-" alt="" /></div>
    // </section>
    return (
      <div className="font-poppins relative min-h-screen bg-no-repeat bg-center bg-cover  " 
      style={{background:`url(${Homebg})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat"}}>
        <div className=" absolute inset-0 bg-black bg-opacity-70 flex py-52 justify-center ">
        <div className="text-center text-white px-6 ">
          <h1 className="text-6xl font-bold">Poornima Institute Of Engineering <span className="block py-4">And Technology</span> </h1>
          
          
          <p className="text-lg mt-4 max-w-2xl mx-auto">
            Discover and participate in amazing events happening around you. Stay updated and never miss out!
          </p>
          <Link to="/events">
  <button className="mt-6 bg-[#755df6] px-6 py-3 rounded-lg shadow-md hover:bg-[#5a40c9] transition text-white">
    Explore Events
  </button>
</Link>
        </div>
      </div>
      </div>
    );
    
}
    
    
  




