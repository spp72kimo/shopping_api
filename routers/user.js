const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/info", userController.requireLogin, userController.userGet);
router.post("/login", userController.userLogin);
router.post("/register", userController.userAdd);

module.exports = router;
