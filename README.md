# Intro

This example code shows how to lock an entire react app behind a Lit JWT.

The react app lives in the client/ folder.

This can be deployed to Heroku and it should work out of the box.

Note that you'll need to modify the access control conditions and resource id in server.js for your own application.

# How it works

Inside server.js, we selectively serve the react app if the user presents a valid JWT created via the Lit Protocol in a query param. We save that JWT in a session cookie so that it's sent with every request, and check it on every request.

You should be able to drop any react app into the "client" folder to protect it with a Lit JWT
