export default function AboutUs() {
  return (
    <section className="py-16 bg-slate-800 text-white font-poppins">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">About Us</h2>

        <div className="max-w-5xl mx-auto text-center mb-12">
          <p className="text-lg text-white">
            Poornima Institute of Engineering and Technology (PIET), Jaipur, was
            established in 2007 by the Shanti Education Society (SES), founded
            in 1999. Affiliated with RTU and recognized by UGC, PIET is
            accredited by NAAC and NBA and approved by AICTE. The institute
            focuses on technical education, research, innovation, and
            entrepreneurship. PIET collaborates with IBM for Cloud Computing and
            Business Intelligence research. 
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {[
            { stat: "4th", label: "Ranked By RTU" },
            { stat: "1800+", label: "Students" },
            { stat: "200+", label: "Faculty Members" },
            { stat: "15+", label: " Years" },
            { stat: "130+", label: "Published Patents" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 hover:scale-105 transition p-6 rounded-lg shadow-md text-center"
            >
              <h3 className="text-3xl font-bold text-primary mb-2 text-[#755df6]">
                {item.stat}
              </h3>
              <p className="text-black">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center mb-12">
          <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
          <p className="text-lg ">
          With the motto "Success is not a
            destination, it's a journey," PIET aims to provide top-notch
            infrastructure and a strong academic foundation to foster
            learning and growth.
          </p>
        </div>
      </div>
    </section>
  );
}
