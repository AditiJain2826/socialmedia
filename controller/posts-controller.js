const { getMongoConnection } = require('../dao/db-connection')
const ObjectID = require('mongodb').ObjectID

exports.getPosts = async function (req, res) {

    const db = await getMongoConnection();
    let finalRes = []
    let finalArr = Array.from(new Set(req.body.userid))
    finalArr.push(req.user[0].userid)
    for (let i = 0; i < finalArr.length; i++) {
        let ans = await db.collection('posts').find({ userid: finalArr[i] }).toArray()
        finalRes.push(...ans)
    }
    res.send(finalRes)

}

//Add new post
exports.addPosts = async function (req, res) {

    const db = await getMongoConnection();
    let ans = await db.collection("posts").insertOne({ userid: req.user[0].userid, post_text: req.body.txt, like: [], comment: [] })
    return res.send(ans.ops[0]);
}

//Delete post
exports.deletePost = async function (req, res) {
    try {
        const db = await getMongoConnection();
        let ans = await db.collection("posts").deleteOne({ "_id": new ObjectID(req.body.id) , "userid": req.user[0].userid })
        if (ans.deletedCount > 0) {
            return res.send("Deleted successfully");
        } else {
            return res.status(400).send("Invalid data")
        }
    } catch (e) {
        return res.status(500).send("Internal server error")
    }
}

//Update post
exports.updatePost = async function (req, res) {
    try {
        const db = await getMongoConnection();
        let ans = await db.collection("posts").updateOne({ "_id": new ObjectID(req.body.id), "userid": req.user[0].userid }, { $set: { post_text: req.body.txt } })
        if (ans.modifiedCount > 0) {
            return res.send("Updated successfully");
        } else {
            return res.status(400).send("Invalid data")
        }

    } catch (e) {
        return res.status(500).send("Internal server error")
    }
}

//Like a Post
exports.likePosts = async function (req, res) {
    try {
        const db = await getMongoConnection();
        let findPost = await db.collection('posts').find({ "_id": new ObjectID(req.body.id) }, { like: 1, _id: 0 }).toArray()
        if (findPost.length > 0) {
            findPost[0].like.push(req.user[0].userid)
            let ans = await db.collection("posts").updateOne({ "_id": new ObjectID(req.body.id) }, { $set: { like: findPost[0].like } })
            return res.send("Success");
        } else {
            return res.status(400).send("Post not found")
        }
    } catch (e) {
        return res.status(500).send("Internal server error")
    }


}

//Comment on a post
exports.commentOnPost = async function (req, res) {
    try {
        const db = await getMongoConnection();
        let findPost = await db.collection('posts').find({ "_id": new ObjectID(req.body.id) }).toArray()
        if (findPost.length > 0) {
            findPost[0].comment.push({ commentedby: req.user[0].userid, comment: req.body.comment })
            let ans = await db.collection("posts").updateOne({ "_id": new ObjectID(req.body.id) }, { $set: { comment: findPost[0].comment } })
            return res.send("Comment saved");
        } else {
            return res.status(400).send("Post not found")
        }
    } catch (e) {
        return res.status(500).send("Internal server error")
    }
}
