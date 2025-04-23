import { useState } from "react";
import loginImg from "../assets/login.jpg"; // Import image

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-gray-100  rounded-lg grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl">
        
        {/* Left Side - Image Section (Hidden on Small Screens) */}
        <div className="hidden md:flex items-center justify-center bg-gray-100 rounded-l-lg p-6">
          <img src={loginImg} alt="Illustration" className="w-full h-fit max-w-xs md:max-w-sm lg:max-w-md" />
        </div>

        {/* Right Side - Form Section */}
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-l-lg transition-all duration-300 ${
                isLogin ? "bg-[#755df6] text-white" : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Sign Up
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-r-lg transition-all duration-300 ${
                !isLogin ? "bg-[#755df6] text-white" : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => setIsLogin(false)}
            >
             Login
            </button>
          </div>

          {isLogin ? <SignupForm /> : <LoginForm />}
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    <form className="space-y-4" onSubmit={handleLogin}>
      <h2 className="text-xl font-semibold text-center">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#755df6]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#755df6]"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="flex justify-between text-sm text-gray-600">
        <label>
          <input type="checkbox" className="mr-1" /> Remember me
        </label>
        <a href="#" className="text-[#755df6] hover:underline">Forgot Password?</a>
      </div>
      <button type="submit" className="w-full bg-[#755df6] text-white p-3 rounded-lg hover:bg-[#5a40c9] transition-all">
        Log In
      </button>
    </form>
  );
}

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signing up with:", { name, email, password, registrationNo, phone });
  };

  return (
    <form className="space-y-4" onSubmit={handleSignup}>
      <h2 className="text-xl font-semibold text-center">Sign Up</h2>
      <input
        type="text"
        placeholder="First Name"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#755df6]"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#755df6]"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#755df6]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#755df6]"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Registration No"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#755df6]"
        value={registrationNo}
        onChange={(e) => setRegistrationNo(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Phone Number"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#755df6]"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <button type="submit" className="w-full bg-[#755df6] text-white p-3 rounded-lg hover:bg-[#5a40c9] transition-all">
        Sign Up
      </button>
    </form>
  );
}
