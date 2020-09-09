const express = require("express");
const router = express.Router();
const {
  postAuthRegister,
  postAuthLogin,
  getAuthMe,
} = require("./controllers/authController");
const { postDate } = require("./controllers/dateController");
const validation = require("./middlewares/auth");
const isAuth = require("./middlewares/isAuth");

router.post("/auth/register", validation, postAuthRegister);
router.post("/auth/login", postAuthLogin);

router.use(isAuth);
router.get("/auth/me", getAuthMe);

router.post("/stylist/:id/date", postDate);
module.exports = router;
