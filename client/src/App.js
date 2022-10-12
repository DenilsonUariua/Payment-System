import "./App.css";
// import browser router
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
// import components
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import Footer from "./components/navigation/Footer";
import Navbar from "./components/navigation/Navbar";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
