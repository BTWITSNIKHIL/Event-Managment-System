import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
 FaEnvelope,  FaMapMarkerAlt

} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div className="">
            <h2 className="text-2xl font-bold">Address</h2>
            <p className="mt-2 text-gray-400">
              Poornima Institute of Engineering and Technology.<br></br> ISI 2. RICO
              Institutional Area Sitapura. Jaipur (Rajasthan)-302022 piet
              jaipur@rtu. ac. in principal. piet@poornima, org iqac. <br></br>piet
              @poornima,org
            </p>
          </div>

          {/* <div className="mx-6">
            <h2 className="text-2xl font-bold">Quick links</h2>
            <ul>
              <li><a href="">Home</a></li>
            </ul>
          </div> */}

          {/* Quick Links */}
          <div className="mx-12">
            <h3 className="text-2xl font-semibold">Contact Info</h3>
            <div className="mt-3 space-y-2 text-gray-400">
              <ul>
                <a href="#" className="flex gap-2  hover:text-gray-300 text-md">
                  <FaPhone className="my-2" size={18} />099285 55222
                </a>
                <li>
                  <a href="#" className="flex gap-2 hover:text-gray-300">
                    <FaEnvelope className="my-1" size={18}/>info@poornima.org
                  </a>
                </li>
                <li>
                  <a href="#" className="flex gap-2 mt-2 hover:text-gray-300">
                    <FaMapMarkerAlt className="mt-1" size={18}/>ISI - 2, Poornima Marg, Sitapura, Jaipur, Rajasthan 302022
                  </a>
                </li>
                <li>
                  
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media */}
          <div className="mx-4">
            <h3 className="text-2xl font-semibold">Follow Us</h3>
            <div className="flex space-x-4 mt-4 text-gray-400">
              <a href="https://m.facebook.com/Poornima.College.Engineering/" className="hover:text-gray-300">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com/poornimacollege" className="hover:text-gray-300">
                <FaTwitter size={24} />
              </a>
              <a href="https://www.instagram.com/poornimacollege" className="hover:text-gray-300">
                <FaInstagram size={24} />
              </a>
              <a href="https://www.linkedin.com/school/poornima-college-of-engineering-jaipur" className="hover:text-gray-300">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 my-6 mt-12" />

        {/* Copyright */}
        <div className=" text-center  text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} PIET. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;