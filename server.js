const express = require("express");
const server = express();
const port = 3000;
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const TruckUser = require("./models/TruckUser");
require("dotenv").config();
const { DB_URI, JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

mongoose
  .connect(DB_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`Connected to DB\nServer is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

server.get("/", (request, response) => {
  response.send("LIVE!");
});

// create user page
server.post("/create-user", async (request, response) => {
  const { username, password, firstname, lastname, email } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  try {
    await newUser
      .save()
      .then((result) =>
        response.status(200).send(`congrats  created username ${username}`)
      );
  } catch (error) {
    console.log(`cannot add user! ${error.message}`);
  }
});

// create truck user page
server.post("/create-TruckUser", async (request, response) => {
  const { username, password, firstname, lastname, email } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newTruckUser = new TruckUser({
    username,
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  try {
    await newTruckUser
      .save()
      .then((result) =>
        response.status(200).send(`congrats  created username ${username}`)
      );
  } catch (error) {
    console.log(`cannot add user! ${error.message}`);
  }
});

server.post("/", (request, response) => {
  const { username, password } = request.body;
  const jwtToken = jwt.sign({ id: username }, JWT_SECRET);
  const user = User.findOne({ username }).then((user) => {
    // if user is not found
    if (!user) {
      return response.send({ message: "user not found" });
    }
    // if user is not found , then
    bcrypt.compare(password, user.password, (error, result) => {
      if (error) {
        return response.send({ message: "An error occured" });
      }

      if (result) {
        return response.send({
          message: "User Autenticated ",
          token: jwtToken,
        });
      } else {
        return response.send({ message: "incorrect username or password" });
      }
    });
  });
});
