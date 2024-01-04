const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");

const LocalStrategy = require("passport-local").Strategy;

const { createProduct } = require("./controller/Product");
const productsRouters = require("./routes/Product");
const categoriesRouters = require("./routes/Category");
const brandsRouters = require("./routes/Brand");
const usersRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const { User } = require("./model/User");
const { sanitizeUser } = require("./services/common");

const server = express();

// Middlewares

server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);

server.use(passport.authenticate("session"));

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json()); // To parse req.body
server.use("/products", isAuth, productsRouters.router); //we can also use jwt token
server.use("/categories", categoriesRouters.router);
server.use("/brands", brandsRouters.router);
server.use("/users", usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", cartRouter.router);
server.use("/orders", orderRouter.router);

//passport strategies
passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ email: username }).exec();
      if (!user) {
        done(null, false, { message: "invalid credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          // TODO: this is just temporary, we will use strong password auth

          if (!crypto.timingSafeEqual(Buffer.from(user.password, 'hex'), hashedPassword)) {
            // TODO: We will make addresses independent of login
            return done(null, false, { message: "invalid credentials" });
          } else {
            done(null, sanitizeUser); //this line sedn to serialize
          }
        }
      );
    } catch (err) {
      done(err);
    }
  })
);
//create session varial req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});
//this changes session variable req.user when called from authorized req
passport.deserializeUser(function (user, cb) {
  console.log("de-serialize", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});
const mongoURI =
  "mongodb+srv://jagtapsumit668:k9twuiN9AjhRZlro@cluster0.tz6fwxx.mongodb.net/e-commerce";

const connectToMongo = () => {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to MongoDB Successful");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

connectToMongo();

server.get("/", (req, res) => {
  res.json({ status: "success" });
});
function isAuth(req, res, done) {
  if (req.user) {
    done();
  } else {
    res.send(401);
  }
}
server.use("/products", createProduct);

server.listen(8080, () => {
  console.log("Server started on port 8080");
});
