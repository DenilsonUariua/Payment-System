require("dotenv").config();

var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");
var User = require("./models/User");
var Product = require("./models/Product");
const cors = require("cors");
var http = require("http");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { PORT } = process.env;

const sessionMiddleware = session({
  key: "user_sid",
  secret: "somerandonstuffs",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000,
  },
});
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    credentials: true,
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
          type: user.type,
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
    let user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
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
          type: docs.type,
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

app.route("/product").post((req, res) => {
  console.log("req.body", req.body);
  let product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    sellerId: "63557d144fd226230c591153",
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
    methods: ["GET", "POST"],
  },
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
// var app = express();

// // set our application port

// // set morgan to log info about our requests for development use.
// app.use(morgan("dev"));

// // initialize cookie-parser to allow us access the cookies stored in the browser.

// // initialize express-session to allow us track the logged-in user across sessions.
// app.use(
//   session({
//     key: "user_sid",
//     secret: "somerandonstuffs",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       expires: 600000,
//     },
//   })
// );

// // route for Home-Page
// app.get("/", sessionChecker, (req, res) => {
//   res.redirect("/login");
// });

// // route for user signup

// // route for user Login
// app
//   .route("/login")
//   .get(sessionChecker, (req, res) => {
//     res.sendFile(__dirname + "/public/login.html");
//   })
//   .post(async (req, res) => {
//     console.log("Login", req.body);
//     io.on("connection", (socket) => {
//       console.log("a user connected");
//     });
//     var email = req.body.email,
//       password = req.body.password;

//     try {
//       var user = await User.findOne({ email: email }).exec();
//       if (!user) {
//         res.status(401).send("User not found");
//       }
//       user.comparePassword(password, (error, match) => {
//         if (!match) {
//           res.send("Incorrect password");
//         }
//       });
//       req.session.user = user;
//       res.status(200).send(`Welcome ${user.firstName}`);
//     } catch (error) {
//       console.log(error);
//     }
//   });

// // route for user's dashboard
// app.get("/dashboard", (req, res) => {
//   if (req.session.user && req.cookies.user_sid) {
//     res.sendFile(__dirname + "/public/dashboard.html");
//   } else {
//     res.redirect("/login");
//   }
// });

// // route for user logout
// app.get("/logout", (req, res) => {
//   if (req.session.user && req.cookies.user_sid) {
//     res.clearCookie("user_sid");
//     res.redirect("/");
//   } else {
//     res.redirect("/login");
//   }
// });

// // route for handling 404 requests(unavailable routes)
// app.use(function (req, res, next) {
//   res.status(404).send("Sorry can't find that!");
// });

// const secureServer = http.createServer(app);
// const io = new Server(secureServer, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("a user connected");
// });
