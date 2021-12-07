const express = require("express");
const LitJsSdk = require("lit-js-sdk");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
var cookieParser = require("cookie-parser");

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

function checkUser(req, res, next) {
  // always permit example.html requests to bypass authentication
  // because it represents a login page
  if (req.url === "/example.html") {
    next();
    return;
  }

  const jwt = req.query?.jwt || req.cookies?.jwt;

  console.log("jwt is ", jwt);

  if (!jwt) {
    res.status(401).send("Unauthorized");
    return;
  }
  const { verified, header, payload } = LitJsSdk.verifyJwt({ jwt });
  if (
    !verified ||
    //payload.baseUrl !== "litognftcontent.litgateway.com" || // Uncomment this and add your own URL that you are protecting
    //payload.path !== "/" || // Uncomment this and add your own URL Path that you are protecting
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
    sameSite: "lax",
  });

  if (req.query?.jwt) {
    const newUrl = req.originalUrl.replace(/\?jwt=.*/, "");
    console.log("redirecting to ", newUrl);
    // redirect to strip the jwt so the user can't just copy / paste this url to share this website
    res.redirect(newUrl);
  }

  next();
}

// Set up the middleware stack
app.use(cookieParser());
app.use(checkUser);
app.use("/example.html", express.static(path.join(__dirname, "example.html")));
app.use("/", express.static(path.join(__dirname, "client/build")));
