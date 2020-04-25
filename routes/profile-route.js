var express = require('express')
const passport = require("passport");
var router = express.Router();
const check  = require('../checkuser')


var profileController = require('../controller/profile-controller')

router.get('/', [check.checkUser, passport.authenticate("jwt", { session: false })], profileController.getProfile)
router.post('/', profileController.addProfile)
router.put('/',[check.checkUser, passport.authenticate("jwt", { session: false })], profileController.updateProfile)
router.delete('/',[check.checkUser, passport.authenticate("jwt", { session: false })], profileController.deleteProfile)

module.exports = router;