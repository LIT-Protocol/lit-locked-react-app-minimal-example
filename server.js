const express = require("express");
const LitJsSdk = require("lit-js-sdk");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
var cookieParser = require("cookie-parser");

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

function checkUser(req, res, next) {
  const jwt = req.query?.jwt || req.cookies?.jwt;

  if (!jwt) {
    res.status(401).send("Unauthorized");
    return;
  }
  const { verified, header, payload } = LitJsSdk.verifyJwt({ jwt });
  if (
    !verified ||
    payload.baseUrl !== "litognftcontent.litgateway.com" ||
    payload.path !== "/" ||
    payload.orgId !== "" ||
    payload.role !== "" ||
    payload.extraData !== ""
  ) {
    // Reject this request!
    res.status(401).send("Unauthorized");
    return;
  }

  res.cookie("jwt", jwt, {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    sameSite: "none",
  });

  next();
}

// Set up the middleware stack
app.use(cookieParser());
app.use(checkUser);
app.use("/", express.static(path.join(__dirname, "client/build")));
