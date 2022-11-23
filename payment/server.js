require("dotenv").config(); // This is your test secret API key.
const { PORT, STRIPE_SECRET, YOUR_DOMAIN } = process.env;
console.log("PORT", PORT);
const stripe = require("stripe")(STRIPE_SECRET);
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    credentials: true
  })
);

app.post("/create-checkout-session", async (req, res) => {
  const { priceId } = req.body;
  console.log("Price ID: ", priceId);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`
  });

  res.redirect(303, session.url);
});
app.post("/create-product", async (req, res) => {
  console.log("Request: ", req);
  const { name, image, description, price } = req.body;
  try {
    const product = await stripe.products.create({
      name: name,
      images: [image],
      description: description
    });
    const priceObject = await stripe.prices.create({
      product: product.id,
      unit_amount: price,
      currency: "usd"
    });
    res.send({ product, priceObject });
  } catch (error) {
    console.log("Error: ", error);
    res.sendStatus(500);
  }
});

app.listen(4242, () => console.log("Running on port 4242"));
