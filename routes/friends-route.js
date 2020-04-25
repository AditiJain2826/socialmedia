var express = require('express');
var router = express.Router();
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken")
const passport = require("passport")
const check  = require('../checkuser')

var friendsController = require('../controller/friends-controller')

router.get('/', [check.checkUser, passport.authenticate("jwt", { session: false })],friendsController.getFriends)
router.post('/', [check.checkUser, passport.authenticate("jwt", { session: false })],friendsController.addFriends)
router.delete('/',[check.checkUser, passport.authenticate("jwt", { session: false })], friendsController.deleteFriends)

module.exports = router;