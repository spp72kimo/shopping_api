require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = new express();
const bodyParser = require("body-parser");
const port = process.env.EXPRESS_PORT || 3000;

const userRouter = require("./routers/user");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.json({ message: "This is shopping web API." });
});

app.listen(port, () => {
  console.log("Server is running on poty: ", port);
});
