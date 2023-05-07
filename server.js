const express = require("express");
const LitJsSdk = require("@lit-protocol/lit-node-client");
const app = express();
const port = process.env.PORT || 5001;
const path = require("path");
var cookieParser = require("cookie-parser");

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

function decode(input) {
  // Replace non-url compatible chars with base64 standard chars
  input = input
      .replace(/-/g, '+')
      .replace(/_/g, '/');

  // Pad out with standard base64 required padding characters
  var pad = input.length % 4;
  if(pad) {
    if(pad === 1) {
      throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
    }
    input += new Array(5-pad).join('=');
  }

  return input;
}

function checkUser(req, res, next) {
  // always permit example.html requests to bypass authentication
  // because it represents a login page
  if (req.url === "/example.html") {
    next();
    return;
  }

  let jwt = req.query?.jwt || req.cookies?.jwt;

  console.log("jwt is ", jwt);

  if (!jwt) {
    res.status(401).send("Unauthorized");
    return;
  }
  
  jwt = decode(jwt);

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
