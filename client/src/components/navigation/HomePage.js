import { useContext } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { UserContext } from "@context";

const backgroundImage =
  "https://images.unsplash.com/photo-1561414927-6d86591d0c4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1973&q=80";

export function HomePage() {
  const { user } = useContext(UserContext);
  const title = "Pay on time, worry free";
  return (
    <Layout
      sxBackground={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: "#7fc7d9", // Average color of the background image.
        backgroundPosition: "center"
      }}
    >
      {/* capitalize */}
      <Typography color="inherit" align="center" variant="h2" marked="center">
        {title.toUpperCase()}
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
      >
        Best Payment Gateway
      </Typography>

      <Link to={user ? "/products" : "/signup"}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          component="a"
          sx={{ minWidth: 200 }}
        >
          {user ? "Products" : "Register"}
        </Button>
      </Link>

      <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
        Payment made easier and safer with Us
      </Typography>
    </Layout>
  );
}
