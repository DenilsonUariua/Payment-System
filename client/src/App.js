import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SignIn, SignUp, Logout } from "@authentication";
import { Navbar, Footer } from "@navigation";
import {Dashboard} from "@pages/dashboard";
import { CreateProduct } from "@products/forms";
import Pricing from "./components/products/Pricing";
import Products from "./components/products/Products";
import { UserContext } from "./use-context/UserContext";
import { io } from "socket.io-client";
const { REACT_APP_AUTH_API_URL } = process.env;
const socket = io(REACT_APP_AUTH_API_URL);

function App() {
  const [user, setUser] = useState(null);
  // client-side
  socket.on("connect", () => {
    console.log(socket.id);
  });
  useEffect(() => {
    localStorage.getItem("user") &&
      setUser(JSON.parse(localStorage.getItem("user")));
    return () => {
      // localStorage.removeItem("user");
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <UserContext.Provider value={{ user, setUser }}>
          <Navbar />
          <Routes>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/create product" element={<CreateProduct />}></Route>
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
