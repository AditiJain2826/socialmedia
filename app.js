const express = require('express')
const routes = require('./routes');
const app = express();
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { getConnection, closeConnection } = require('./dao/db-connection')
require('dotenv').config()

app.use(express.json());

app.use("/", routes);

//passport
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromHeader('auth_token');
opts.secretOrKey = process.env.SECRETKEY;
passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {

        const client = await getConnection();
        let response = null;
        if (client) {
            await client.query("select * from profile where userid=" + jwt_payload.userid)
                .then((result) => response = (result.rows))
                .catch((error) => console.log("error"));
            await closeConnection(client)
            return done(null, response);
        }
    })
);

app.listen(3000, () => {
    console.log(`Listening to requests `);
});


