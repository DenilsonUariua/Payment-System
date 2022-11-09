import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SignIn, SignUp, Logout } from "@authentication";
import { Navbar, Footer, HomePage } from "@navigation";
import { Dashboard } from "@pages/dashboard";
import { CreateProduct } from "@products/forms";
import { Pricing, Products } from "@products";
import { Purchases } from "@purchases";
import { UserContext } from "./use-context/UserContext";

function App() {
  const [user, setUser] = useState(null);
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
            {/* add homepage */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/create product" element={<CreateProduct />}></Route>
            <Route path="/pricing" element={<Pricing />}></Route>
            <Route path="/products" element={<Products />}></Route>
            <Route path="/purchases" element={<Purchases />}></Route>
            <Route path="/logout" element={<Logout />}></Route>
          </Routes>
          <Footer />
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
