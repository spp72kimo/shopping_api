const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const salt = bcrypt.genSaltSync(10);
const { resError } = require("../utils");

const userController = {
  requireLogin: (req, res, next) => {
    let authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return res.json(resError("You have no token."));
    (req.token = token), next();
  },
  userGet: (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) return res.json(resError("JWT is invalid."));
      const { id, username } = decoded;
      User.findOne({
        where: {
          id,
          username,
        },
      }).then((userData) => {
        if (!userData) return res.json(resError("No match user data."));
        const { id, username, email, role, createdAt } = userData;
        res.json({ id, username, email, createdAt, ok: 1 });
      });
    });
  },

  userAdd: (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email)
      return res.json(resError("Your input not completed."));
    bcrypt.hash(password, salt, (err, hash) => {
      User.create({
        username,
        password: hash,
        email,
      })
        .then((data) => {
          const { id, username } = data;
          res.json({
            message: "Add user successfully.",
            token: jwt.sign({ id, username }, process.env.JWT_SECRET_KEY),
            ok: 1,
          });
        })
        .catch((err) => {
          res.json(resError(err.name + err.message));
        });
    });
  },
  userLogin: (req, res) => {
    const { username, password } = req.body;

    User.findOne({
      where: {
        username,
      },
    }).then((data) => {
      const { id, username, email } = data;
      const hash = data.password;
      bcrypt.compare(password, hash, (err, result) => {
        console.log("result: ", result);
        if (result) {
          return res.json({
            token: jwt.sign(
              { id, username, email },
              process.env.JWT_SECRET_KEY
            ),
            ok: 1,
          });
        } else return res.json(resError("Username or password is wrong!"));
      });
    });
  },
};

module.exports = userController;
