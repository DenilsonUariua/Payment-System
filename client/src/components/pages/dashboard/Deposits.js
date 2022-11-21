import React, { useEffect, useState, useContext } from "react";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import { UserContext } from "@context";
import axios from "axios";
// get api url
const {
  REACT_APP_AUTH_API_URL_PRODUCTION,
  REACT_APP_AUTH_API_URL_DEVELOPMENT,
  NODE_ENV
} = process.env;

export default function Deposits() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    user &&
      axios
        .get(
          `${
            NODE_ENV === "production"
              ? REACT_APP_AUTH_API_URL_PRODUCTION
              : REACT_APP_AUTH_API_URL_DEVELOPMENT
          }/user-purchases/${user.buyerId}`
        )
        .then((res) => {
          setProducts(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [user]);
  // function to format the date
  const formatDate = (date) => {
    const newDate = new Date(date);
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    const year = newDate.getFullYear();
    return `${month}/${day}/${year}`;
  };
  return (
    <React.Fragment>
      <Title>Recent Payments</Title>
      <br />
      <Typography component="p" variant="h4">
        {loading
          ? "Loading..."
          : `N$${products.reduce(
              (acc, curr) => acc + curr.productId.price,
              0
            )}`}
      </Typography>
      {/* space */}
      <br />
      <br />
      <br />
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {`Last payment on ${
          loading
            ? "Loading..."
            : products.length > 0
            ? formatDate(products[products.length - 1].createdAt)
            : "No payments"
        }`}{" "}
      </Typography>
    </React.Fragment>
  );
}
