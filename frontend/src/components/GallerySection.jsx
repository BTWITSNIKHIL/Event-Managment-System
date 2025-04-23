
import bg from "../assets/gallerybg1.jpg"
import bg2 from "../assets/gallerybg2.jpg"
import bg3 from "../assets/gallerybg.jpg"
import bg4 from "../assets/bg.jpg"
import cardimg from "../assets/cardimg.avif"
import cardimg1 from "../assets/cardimg2.jpeg"
import cardimg2 from "../assets/cardimg3.jpeg"

export default function GallerySection() {
  const galleryItems = [
    {
      title: "Private office",
      image: bg,
    },
    {
      title: "Dedicated desk",
      image: bg3,
    },
    {
      title: "Hot desk",
      image: cardimg,
    },
    {
      title: "Meeting room",
      image: cardimg1,
    },
    {
      title: "Day pass",
      image: cardimg2,
    },
    {
      title: "Event spaces",
      image: bg4,
    },
  ];
  return(
    // <div className="gallery flex flex-col  text-center ">
    //   <h2 className="p-4 font-medium text-xl">GALLERY SECTION</h2>
    //   <div className="mt-3 relative gallery min-h-screen " style={{background:`url(${bg})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat"}} alt="">
    //     <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center">
        
    //     </div>
        
    //     </div>
    // </div>
    <div className="gallery relative font-poppins min-h-screen">
<h1 className="absolute top-8 left-1/2 transform -translate-x-1/2 text-4xl mb-7 font-semibold text-black mt-4 text-center z-10">
    Captured Memories
  </h1>
    <div className="min-h-screen h-[850px] relative" style={{background:`url(${bg2})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat"}} alt="">

      <div className="absolute inset-0 bg-opacity-30 ">
        
<div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 w-full mt-32 max-w-6xl">
        {galleryItems.map((item, index) => (
          <div key={index} className="bg-white rounded-lg  shadow-lg overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full object-cover  transition-transform duration-300 hover:scale-105"
            />
            <div className="p-2 text-center">
              <h3 className="text-lg font-semibold">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>

    </div>
    </div>
    
    
    
  )
}