import { useState, useEffect } from "react";
import "./Checkout.css";
import Box from "@mui/material/Box";

import { useLocation } from "react-router-dom";

const { REACT_APP_PAYMENTS_API_URL } = process.env;

const ProductDisplay = () => {
  const location = useLocation();
  const { purchase } = location.state;

  console.log("purchase", purchase);
  return (
    <Box
      sx={{
        display: "flex",
        height: "80vh",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <section className="section">
        <div className="product">
          <img
            className="image"
            src={purchase.productId.image}
            alt="The cover of Stubborn Attachments"
          />
          <div className="description">
            <h3 className="header3">{purchase.productId.name}</h3>
            <h5 className="header5">N${purchase.productId.price}</h5>
          </div>
        </div>
        <form
          action={`${REACT_APP_PAYMENTS_API_URL}/create-checkout-session`}
          method="POST"
        >
          <input
            type="hidden"
            name="priceId"
            value={purchase.productId.stripePriceId}
          />
          <button className="button" type="submit">
            Checkout
          </button>
        </form>
      </section>
    </Box>
  );
};

const Message = ({ message }) => (
  <section className="section">
    <p className="paragraph">{message}</p>
  </section>
);

export const Checkout = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return message ? <Message message={message} /> : <ProductDisplay />;
};
