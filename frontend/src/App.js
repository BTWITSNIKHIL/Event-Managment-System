import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events";
import ParticipatedEvents from "./pages/ParticipatedEvents";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/events" element={<Events />} />
        <Route path="/participated-events" element={<ParticipatedEvents />} />
      </Routes>
    </Router>
  );
}

export default App;
