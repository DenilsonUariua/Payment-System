import "./App.css";
import { useState, useEffect } from "react";
// import browser router
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import components
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import Logout from "./components/authentication/Logout";
import Footer from "./components/navigation/Footer";
import Navbar from "./components/navigation/Navbar";
import Dashboard from "./components/pages/dashboard/Dashboard";
import CreateProduct from "./components/products/forms/CreateProduct.form";
import Pricing from "./components/products/Pricing";
import Products from "./components/products/Products";
import { UserContext } from "./use-context/UserContext";
// socket io
import { io } from "socket.io-client";
const { REACT_APP_AUTH_API_URL } = process.env;
const socket = io(REACT_APP_AUTH_API_URL);

function App() {
  const [user, setUser] = useState(null);
  // client-side
  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });
  useEffect(() => {
    localStorage.getItem("user") &&
      setUser(JSON.parse(localStorage.getItem("user")));
    return () => {
      // localStorage.removeItem("user");
    };
  }, [user]);

  return (
    <Router>
      <div className="App">
        <UserContext.Provider value={{ user, setUser }}>
          <Navbar />
          <Routes>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/create-product" element={<CreateProduct />}></Route>
            <Route path="/pricing" element={<Pricing />}></Route>
            <Route path="/products" element={<Products />}></Route>
            <Route path="/logout" element={<Logout />}></Route>
          </Routes>
          <Footer />
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;