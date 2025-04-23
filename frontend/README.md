# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


/**************EVENTS-SECTION ******************/
<div className="min-h-screen bg-gray-300 p-8">
    <h1 className="text-4xl font-extrabold text-black text-center mb-8">
     College Events 2025
    </h1>
    <div className="flex flex-row  flex-wrap justify-center  mt-16 ">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white shadow-lg rounded-2xl overflow-hidden  mx-5 w-[400px]  transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <img className="w-full h-72 object-cover " src={bg} alt={event.title} />
          <div className="p-5 flex flex-col text-center">
            <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
            <p className="text-gray-600 text-sm mt-2">{event.description}</p>
            <div className="mt-4 text-gray-700">
              
            </div>
            
          </div>
        </div>
      ))}
    </div>
    
  </div>


  /***********GALLERY***************/
  export default function GallerySection() {
    // const images = [
    //   "https://source.unsplash.com/300x200/?party,concert",
    //   "https://source.unsplash.com/300x200/?sports,college",
    //   "https://source.unsplash.com/300x200/?conference,people",
    // ];
    const teachers = [
      {
        name: "AArohan",
        role: "2024",
        image: "https://media.istockphoto.com/id/1247853982/photo/cheering-crowd-with-hands-in-air-at-music-festival.jpg?s=612x612&w=0&k=20&c=rDVKf3hTryuVgUZUme9wuwfsegfJptAvVEKsDwppvJc=",
      },
      {
        name: "Freshers",
        role: "2021",
        image: "https://media.istockphoto.com/id/1247853982/photo/cheering-crowd-with-hands-in-air-at-music-festival.jpg?s=612x612&w=0&k=20&c=rDVKf3hTryuVgUZUme9wuwfsegfJptAvVEKsDwppvJc=",
      },
      {
        name: "Alumni",
        role: "2021",
        image: "https://media.istockphoto.com/id/1247853982/photo/cheering-crowd-with-hands-in-air-at-music-festival.jpg?s=612x612&w=0&k=20&c=rDVKf3hTryuVgUZUme9wuwfsegfJptAvVEKsDwppvJc=",
      },
      {
        name: "Alumni",
        role: "2024",
        image: "https://media.istockphoto.com/id/1247853982/photo/cheering-crowd-with-hands-in-air-at-music-festival.jpg?s=612x612&w=0&k=20&c=rDVKf3hTryuVgUZUme9wuwfsegfJptAvVEKsDwppvJc=",
      },
      
    ];
  
    return (
      // <section className="py-16 px-4 text-center h-screen bg-gray-200">
      //   <h2 className="text-3xl font-bold">Gallery</h2>
      //   <div className="mt-6 flex flex-wrap justify-center gap-6">
      //     {images.map((img, index) => (
      //       <img key={index} src={img} alt="Event" className="w-64 h-40 rounded-lg shadow-md" />
      //     ))}
      //   </div>
      <section className="py-16 px-4 text-center h-screen bg-gray-200">
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 p-6 h-5/6 ">
        {teachers.map((teacher, index) => (
          <div key={index} className="bg-white shadow-lg rounded-2xl p-4 flex flex-col  hover:scale-105">
            <div className="relative h-80 mx-auto mb-4 ">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-full h-full object-cover  hover:max-sm:"
              />
              
            </div>
            <div className="">
            <h2 className="text-xl font-semibold text-center ">{teacher.name}</h2>
            <p className="text-gray-600 text-center  ">{teacher.role}</p>
            </div>
            
          </div>
        ))}
      </div>
      <button className="mt-14 px-6 py-3 bg-[#755df6] text-white rounded-lg font-semibold hover:bg-[#5337f2] ">Explore More</button>
      </section>
  
    );
  }

/******************NAVBAR**************************/
<div className="header flex justify-between items-center py-2 px-2 bg-gray-200   shadow-xl border">
      {/* Logo Section */}
      <div className="logo text-3xl px-8 font-bold text-[#755df6] ">
        DEMS
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <ul className="flex space-x-6   px-14 py-3 rounded-lg">
          <li>
            <Link to="/" className="text-[#755df6]  font-semibold text-lg hover:text-gray-700">Home</Link>
          </li>
          <li>
            <Link to="/events" className="text-[#755df6]  font-semibold text-lg hover:text-gray-700">Events</Link>
          </li>
          <li>
            <Link to="/gallery" className="text-[#755df6]  font-semibold text-lg hover:text-gray-700">Gallery</Link>
          </li>
          <li>
            <Link to="/about" className="text-[#755df6] font-semibold text-lg hover:text-gray-700">About Us</Link>
          </li>
          
        </ul>
      </nav>
    </div>