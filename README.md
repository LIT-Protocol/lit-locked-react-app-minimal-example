# Intro

This example code shows how to lock an entire react app behind a Lit JWT.

The react app lives in the client/ folder.

This can be deployed to Heroku and it should work out of the box.

Note that you'll need to modify the access control conditions and resource id in server.js for your own application.

# How it works

Inside server.js, we selectively serve the react app if the user presents a valid JWT created via the Lit Protocol in a query param. We save that JWT in a session cookie so that it's sent with every request, and check it on every request.

You should be able to drop any react app into the "client" folder to protect it with a Lit JWT

# Example code

This app expects a Lit JWT in the query param "jwt". To test generating this JWT, you can use example.html.

Steps:

1. `cd client` and then `yarn build` to build your React app. During development, you can use `yarn start` to start the server on port 3000 instead of using `yarn build`. Note, however, that when running in dev mode via `yarn start`, the content isn't protected by server.js and any token gating or access control condition gating will not be applied.
2. When you're ready to test the protection in server.js, and you've already build the app in the client directory with `yarn build`, then you can run `yarn start` to start the server in the root of the repository.
3. You can then visit http://localhost:5000/example.html in your browser to see the example app. The example app will mint an NFT (step 1), provision access to this server to only permit users who hold that NFT (step 2), request a jwt to use to send to the server (step 3), and finally redirect you to the server with the JWT as a url parameter (step 4).

Note that minting the nft (step 1) is entirely optional, and in your own code, you may choose to use an already existing NFT instead of minting a new one. You should choose your own accessControlConditions and resourceId and set those in example.html (if you wish to use it for testing), and in server.js.
