const express = require("express");
const router = express.Router();
const {
  postAuthRegister,
  postAuthLogin,
  getAuthMe,
} = require("./controllers/authController");
const {
  postDate,
  getDates,
  putDate,
  deleteDate,
} = require("./controllers/dateController");

const {
  getRates,
  postRate,
  putRate,
  deleteRate,
} = require("./controllers/rateController");

const { putUser, getUsers } = require("./controllers/userController");
const {
  registerValidation,
  userUpdateValidation,
} = require("./middlewares/validations");
const isAuth = require("./middlewares/isAuth");

router.post("/auth/register", registerValidation, postAuthRegister);
router.post("/auth/login", postAuthLogin);

router.use(isAuth);
router.get("/auth/me", getAuthMe);

router.post("/user/:id/date", postDate);
router.get("/user/:id/date", getDates);
router.put("/user/date/:id", putDate);
router.delete("/user/date/:id", deleteDate);

router.post("/user/:id/rate", postRate);
router.get("/user/:id/rate", getRates);
router.put("/user/:uid/rate/:id", putRate);
router.delete("/user/:uid/rate/:id", deleteRate);

router.get('/user', getUsers);
router.put("/user", userUpdateValidation, putUser);
module.exports = router;
