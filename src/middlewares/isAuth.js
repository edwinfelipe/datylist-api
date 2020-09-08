const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET || "secretKey", function (
      err,
      decoded
    ) {
      
      if (err)
        return res
          .status(401)
          .json({ error: "The provided token is not valid" });
      req.user = decoded.user;
      next();
    });
  } else res.status(401).json({ error: "Authorization token is required" });
};

module.exports = isAuth;
