// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51M67PrFBJmZ6yvBhewywxL84HBovk819A9a9msJn5zNgiQSZ0aKB6vKs0CwjM57IXQebRA6X428vdG2WmDqQ87o200IYWZRViY"
);
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
    credentials: true,
  })
);
const YOUR_DOMAIN = "http://localhost:4242";

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1M6hOJFBJmZ6yvBhMGLUnCg5",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
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
      description: description,
    });
    const priceObject = await stripe.prices.create({
      product: product.id,
      unit_amount: price,
      currency: "usd",
    });
    res.send({ product, priceObject });
    
  } catch (error) {
    console.log("Error: ", error);
    res.sendStatus(500)
  }
});


app.listen(4242, () => console.log("Running on port 4242"));
