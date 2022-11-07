require("dotenv").config();

var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");
var User = require("./models/User");
var Product = require("./models/Product");
var Purchase = require("./models/Purchase");
const cors = require("cors");
var http = require("http");
const { createServer } = require("http");
const { Server } = require("socket.io");
var uniqid = require("uniqid");
const { PORT } = process.env;

const sessionMiddleware = session({
  key: "user_sid",
  secret: "somerandonstuffs",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
});
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

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

// // initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(morgan("dev"));
// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
  console.log("sessionChecker", req.session.user);
  if (req.session.user) {
    res.send("/dashboard", { user: req.session.user });
  } else {
    next();
  }
};
app.get("/login", sessionChecker, (req, res) => {
  res.send("/login");
});

app.post("/login", sessionChecker, async (req, res) => {
  let email = req.body.email,
    password = req.body.password;

  try {
    var user = await User.findOne({ email: email }).exec();
    if (!user) {
      res.status(401).send("User not found");
    }
    user.comparePassword(password, (error, match) => {
      if (!match) {
        return res.status(401).send("Wrong Password");
      } else {
        req.session.user = user;
        req.session.authenticated = true;
        return res.status(200).send({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          buyerId: user.buyerId,
          sellerId: user.sellerId
        });
      }
    });
  } catch (error) {
    console.log(error);
  }

  // res.status(200).send("ok");
  console.log("req.session", req.session);
  await req.session.save();
});
app
  .route("/signup")
  .get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + "/public/signup.html");
  })
  .post((req, res) => {
    // generate an id
    const buyerId = uniqid("buyer-");
    const sellerId = uniqid("seller-");

    let user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      buyerId: buyerId,
      sellerId: sellerId
    });
    user.save(async (err, docs) => {
      if (err) {
        console.log("Error: ", err);
        res.status(500).send("Error registering new user please try again.");
      } else {
        console.log("Success: ", docs);
        req.session.user = docs;
        res.status(200).send({
          firstName: docs.firstName,
          lastName: docs.lastName,
          email: docs.email,
          buyerId: docs.buyerId,
          sellerId: docs.sellerId
        });
      }
    });
  });

app.route("/products").get((req, res) => {
  Product.find({}, (err, docs) => {
    if (err) {
      console.log("Error: ", err);
      res.status(500).send("Error fetching products");
    } else {
      console.log("Success: ", docs);
      res.status(200).send(docs);
    }
  });
});
app.route("/purchases/buyer/:id").get((req, res) => {
  Purchase.find({ buyerId: req.params.id })
    .populate("productId")
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
app.route("/user-purchases/:id").get((req, res) => {
  Purchase.find({ buyerId: req.params.id })
    .populate("productId")
    .then((docs) => {
      res.status(200).send(docs);
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(500).send("Error fetching purchases");
    });
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
    (err, docs) => {
      if (err) {
        console.log("Error: ", err);
      } else {
        Product.findOneAndUpdate(
          { _id: docs.productId },
          { status: "Paid Awaiting Delivery" },
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
  Purchase.find({ sellerId: req.params.id }, (err, docs) => {
    if (err) {
      console.log("Error: ", err);
      res.status(500).send("Error fetching products");
    } else {
      console.log("Success: ", docs);
      const pending = docs.filter((doc) => doc.status === "Pending");
      res.status(200).send(pending);
    }
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
        { status: "Payment Pending" },
        (err, docs) => {
          if (err) {
            console.log("Error: ", err);
            res.status(500).send("Error updating product status");
          } else {
            console.log("Success: ", docs);
          }
        }
      );
      res.send({ purchaseId: data.purchaseId });
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
    sellerId: req.body.sellerId
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

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

// only allow authenticated users
io.use((socket, next) => {
  const session = socket.request.session;
  if (session && session.authenticated) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("Connected", socket.request.session);
});
