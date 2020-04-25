var express = require('express')
var router = express.Router()
const passport = require("passport")
const check  = require('../checkuser')

var postController = require('../controller/posts-controller')

router.post('/',[check.checkUser, passport.authenticate("jwt", { session: false })], postController.addPosts)
router.delete('/', [check.checkUser, passport.authenticate("jwt", { session: false })], postController.deletePost)
router.put('/', [check.checkUser, passport.authenticate("jwt", { session: false })], postController.updatePost)
router.post('/filterposts',[check.checkUser, passport.authenticate("jwt", { session: false })], postController.getPosts)
router.post('/likepost',[check.checkUser, passport.authenticate("jwt", { session: false })],postController.likePosts)
router.post('/commentonpost',[check.checkUser, passport.authenticate("jwt", { session: false })],postController.commentOnPost)


module.exports = router;