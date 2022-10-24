import "./App.css";
// import browser router
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import components
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import Footer from "./components/navigation/Footer";
import Navbar from "./components/navigation/Navbar";
import Dashboard from "./components/pages/Dashboard";
// socket io
import { io } from "socket.io-client";
const { REACT_APP_AUTH_API_URL } = process.env;
const socket = io(REACT_APP_AUTH_API_URL);
function App() {
  // client-side
  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
