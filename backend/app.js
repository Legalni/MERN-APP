const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const csrf = require("csurf");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

const app = express();

const MONGODB_URI =
  "mongodb+srv://filip:Necesdobiti1.@atlascluster.ze95moh.mongodb.net/agriculture?retryWrites=true&w=majority";

// const csrfProtection = csrf({
//   cookie: true,
// });
// app.use(csrfProtection);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// app.get("/getCSRFToken", (req, res, next) => {
//   res.json({ CSRFToken: req.CSRFToken() });
// });

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

app.use("/", (req, res) => {
  console.log("cookie");
});

app.use((error, req, res, next) => {
  console.log(error);
  // const status = error.statusCode || 500;
  // const message = error.message;
  // const data = error.data;
  // res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
