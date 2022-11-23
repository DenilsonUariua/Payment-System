require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const Product = require("./models/Product");
const Customer = require("./models/Customer");
const Entrepreneur = require("./models/Entrepreneur");
const Purchase = require("./models/Purchase");
const Payment = require("./models/Payment");
const cors = require("cors");
const http = require("http");
const { createServer } = require("http");
const { PORT } = process.env;

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    credentials: true
  })
);
const httpServer = createServer(app);

app.use(cookieParser());

// // initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.post("/customer/signin", async (req, res) => {
  let email = req.body.email,
    password = req.body.password;

  try {
    var user = await Customer.findOne({ email: email }).exec();
    if (!user) {
      res.status(401).send("User not found");
    }
    user.comparePassword(password, (error, match) => {
      if (!match) {
        return res.status(401).send("Wrong Password");
      } else {
        return res.status(200).send({
          fullname: user.fullname,
          email: user.email,
          buyerId: user._id,
          sellerId: user._id,
          type: user.type
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});
app.post("/entrepreneur/signin", async (req, res) => {
  let email = req.body.email,
    password = req.body.password;

  try {
    var user = await Entrepreneur.findOne({ email: email }).exec();
    if (!user) {
      res.status(401).send("User not found");
    }
    user.comparePassword(password, (error, match) => {
      if (!match) {
        return res.status(401).send("Wrong Password");
      } else {
        return res.status(200).send({
          fullname: user.fullname,
          email: user.email,
          buyerId: user._id,
          sellerId: user._id,
          type: user.type
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.route("/create/customer").post((req, res) => {
  const {
    fullname,
    idNumber,
    cellphone,
    altCellphone,
    email,
    address,
    password,
    idUrl,
    waterElecBillUrl
  } = req.body;
  let customer = new Customer({
    fullname: fullname,
    idNumber: idNumber,
    cellphone: cellphone,
    altCellphone: altCellphone,
    email: email,
    address: address,
    password: password,
    idUrl: idUrl,
    waterElecBillUrl: waterElecBillUrl
  });
  customer.save((err, docs) => {
    if (err) {
      console.log("Error: ", err);
      res.status(500).send("Error registering new customer please try again.");
    } else {
      res.status(200).send({
        fullname: docs.fullname,
        email: docs.email,
        buyerId: docs._id,
        sellerId: docs._id,
        type: docs.type
      });
    }
  });
});
app.route("/create/entrepreneur").post((req, res) => {
  const {
    fullname,
    idNumber,
    cellphone,
    altCellphone,
    email,
    address,
    businessName,
    businessResgistrationNo,
    socialSecurityNumber,
    password,
    idUrl,
    waterElecBillUrl,
    socialSecurityEmployerCertUrl,
    certificateOfIncorporationUrl,
    policeClearanceUrl
  } = req.body;
  const entrepreneur = new Entrepreneur({
    fullname: fullname,
    idNumber: idNumber,
    cellphone: cellphone,
    altCellphone: altCellphone,
    email: email,
    address: address,
    businessName: businessName,
    businessResgistrationNo: businessResgistrationNo,
    socialSecurityNumber: socialSecurityNumber,
    password: password,
    idUrl: idUrl,
    waterElecBillUrl: waterElecBillUrl,
    socialSecurityEmployerCertUrl: socialSecurityEmployerCertUrl,
    certificateOfIncorporationUrl: certificateOfIncorporationUrl,
    policeClearanceUrl: policeClearanceUrl
  });
  entrepreneur.save((err, docs) => {
    if (err) {
      console.log("Error: ", err);
      res
        .status(500)
        .send("Error registering new entrepreneur please try again.");
    } else {
      res.status(200).send({
        fullname: docs.fullname,
        email: docs.email,
        buyerId: docs._id,
        sellerId: docs._id,
        type: docs.type
      });
    }
  });
});

app.route("/products").get((req, res) => {
  Product.find({ status: "Available" })
    .populate("sellerId")
    .then((docs, err) => {
      if (err) {
        console.log("Error: ", err);
        res.status(500).send("Error fetching products");
      } else {
        console.log("Success: ", docs);
        res.status(200).send(docs);
      }
    });
});
app.route("/orders/:id").get((req, res) => {
  Purchase.find({ sellerId: req.params.id })
    .populate("productId")
    .populate("buyerId")
    .then((docs) => {
      const awaitingDelivery = docs.filter(
        (doc) =>
          doc.status === "Paid Awaiting Delivery" ||
          doc.status === "Awaiting Verification"
      );
      console.log("Success: ", awaitingDelivery);
      res.status(200).send(awaitingDelivery);
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(500).send("Error fetching purchases");
    });
});
app.route("/customers/:id").get((req, res) => {
  Purchase.find({ sellerId: req.params.id })
    .populate("productId")
    .populate("buyerId")
    .then((docs) => {
      console.log("Success: ", docs);
      res.status(200).send(docs);
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(500).send("Error fetching purchases");
    });
});
app.route("/purchases/buyer/:id").get((req, res) => {
  Purchase.find({ buyerId: req.params.id })
    .populate("productId")
    .populate("sellerId")
    .then((docs) => {
      console.log("Success: ", docs);
      const verified = docs.filter((doc) => doc.status === "Verified");
      res.status(200).send(verified);
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(500).send("Error fetching purchases");
    });
});
app.route("/customer-purchases/:id").get((req, res) => {
  Purchase.find({ buyerId: req.params.id })
    .populate("productId")
    .populate("buyerId")
    .populate("sellerId")
    .then((docs) => {
      res.status(200).send(docs);
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(500).send("Error fetching purchases");
    });
});
app.route("/entrepreneur-purchases/:id").get((req, res) => {
  Purchase.find({ sellerId: req.params.id })
    .populate("productId")
    .populate("buyerId")
    .populate("sellerId")
    .then((docs) => {
      res.status(200).send(docs);
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(500).send("Error fetching purchases");
    });
});
app.route("/purchases/buy/:id").get((req, res) => {
  Purchase.findOneAndUpdate(
    { _id: req.params.id },
    { status: "Sold" },
    (err, docs) => {
      if (err) {
        console.log("Error: ", err);
      } else {
        Product.findOneAndUpdate(
          { _id: docs.productId },
          { status: "Sold" },
          (err, product) => {
            if (err) {
              res.status(500);
              console.log("Error: ", err);
            } else {
              Payment.findOneAndUpdate(
                { purchaseId: docs._id },
                { status: "Paid" },
                (err, payment) => {
                  if (err) {
                    res.status(500);
                    console.log("Error: ", err);
                  } else {
                    res.status(200).send(docs);
                    console.log("Success: ", product);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
app.route("/purchases/confirm/:id").get((req, res) => {
  Purchase.findOneAndUpdate(
    { _id: req.params.id },
    { status: "Verified" },
    (err, docs) => {
      if (err) {
        console.log("Error: ", err);
      } else {
        Product.findOneAndUpdate(
          { _id: docs.productId },
          { status: "Verified" },
          (err, product) => {
            if (err) {
              res.status(500);
              console.log("Error: ", err);
            } else {
              res.status(200).send(docs);
              console.log("Success: ", product);
            }
          }
        );
      }
    }
  );
});
app.route("/purchases/pay/:id").get((req, res) => {
  Purchase.findOneAndUpdate(
    { _id: req.params.id },
    { status: "Paid Awaiting Delivery" },
    (err, purchase) => {
      if (err) {
        console.log("Error: ", err);
      } else {
        const payment = new Payment({
          purchaseId: purchase._id
        });
        payment.save((err, payment) => {
          if (err) {
            console.log("Error: ", err);
          } else {
            Product.findOneAndUpdate(
              { _id: purchase.productId },
              { status: "Paid Awaiting Delivery" },
              (err, product) => {
                if (err) {
                  res.status(500);
                  console.log("Error: ", err);
                } else {
                  res.status(200).send(payment);
                  console.log("Success: ", product);
                }
              }
            );
          }
        });
      }
    }
  );
});

app.route("/purchases/reject/:id").get((req, res) => {
  Purchase.findOneAndDelete({ _id: req.params.id }, (err, docs) => {
    if (err) {
      console.log("Error: ", err);
    } else {
      console.log("Success: ", docs);
      Product.findOneAndUpdate(
        { _id: docs.productId },
        { status: "Available" },
        (err, product) => {
          if (err) {
            res.status(500);
            console.log("Error: ", err);
          } else {
            res.status(200).send(docs);
            console.log("Success: ", product);
          }
        }
      );
    }
  });
});
app.route("/purchases/seller/:id").get((req, res) => {
  Purchase.find({ sellerId: req.params.id })
    .populate("productId")
    .populate("buyerId")
    .then((docs) => {
      const pending = docs.filter(
        (doc) => doc.status === "Awaiting Verification"
      );
      res.status(200).send(pending);
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(500).send("Error fetching purchases");
    });
});
app.route("/purchase").post((req, res) => {
  console.log("req.body", req.body);
  const purchase = new Purchase(req.body);
  purchase.save((err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      // use productId to update product status
      Product.findOneAndUpdate(
        { _id: req.body.productId },
        { status: "Awaiting Verification" },
        (err, docs) => {
          if (err) {
            console.log("Error: ", err);
            res.status(500).send("Error updating product status");
          } else {
            console.log("Success: ", docs);
            res.status(200);
          }
        }
      );
    }
  });
});

app.route("/purchases/:id").get((req, res) => {
  Purchase.find({ buyerId: req.params.id }, (err, docs) => {
    if (err) {
      console.log("Error: ", err);
      res.status(500).send("Error fetching products");
    } else {
      console.log("Success: ", docs);
      res.status(200).send(docs);
    }
  });
});
app.route("/product").post((req, res) => {
  console.log("req.body", req.body);
  let product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    sellerId: req.body.sellerId,
    stripePriceId: req.body.stripePriceId
  });
  product.save(async (err, docs) => {
    if (err) {
      console.log("Error: ", err);
      res.status(500).send("Error registering new product please try again.");
    } else {
      console.log("Success: ", docs);
      res.status(200).send(docs);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
