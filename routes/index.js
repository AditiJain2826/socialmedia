const express = require("express");
const { getConnection, closeConnection } = require('../dao/db-connection')
const jwt = require("jsonwebtoken");
const profileRoutes = require('./profile-route');
const friendRoutes = require('./friends-route');
const postsRoutes = require('./posts-route');

const router = express.Router();

router.post("/signin", async (req, res) => {
    const client = await getConnection();
    let response
    await client.query("select * from profile where userid=" + req.body.userid)
        .then((result) => response = (result.rows))
        .catch((error) => console.log(error));
    await closeConnection(client)
    if (response && response[0].password === req.body.password) {
        const token = await jwt.sign({ userid: req.body.userid }, process.env.SECRETKEY);
        res.send(token);
    } else {
        res.send("Incorrect credentials. Please enter correct credentials");
    }
});

router.use("/profile", profileRoutes);
router.use("/friend", friendRoutes);
router.use("/posts", postsRoutes);

router.use('*', (req, res) => {
    res.status(404).send("Page Not Found")
})

module.exports = router;