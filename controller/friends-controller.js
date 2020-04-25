const { getConnection, closeConnection } = require('../dao/db-connection')

// Get list of all friends for specific userid passed as path parameter
exports.getFriends = async function (req, res, next) {
    const client = await getConnection();
    let response = null;
    await client.query("select * from friends where userid="+req.user[0].userid)
        .then((result) => response = (result.rows))
        .catch((error) => { throw error; });
    await closeConnection(client)
    return res.send(response);
}

// Add friend
exports.addFriends = async function (req, res, next) {
    const client = await getConnection();
    let response = null;
    if(req.user[0].userid == req.body.friendid){
        return res.status(400).send("Invalid Data");
    }
    await client.query("insert into friends(userid,friendid) values ("+req.user[0].userid+","+req.body.friendid+" ) ")
        .then((result) => response = "Friend Added Successfully")
        .catch((error) => response = "Something went wrong");
    await closeConnection(client)
    return res.send(response);
}

//Delete Friend
exports.deleteFriends=async function (req, res, next) {
    const client = await getConnection();
    let response = null;
    await client.query("delete from friends where userid="+req.user[0].userid+" and friendid="+req.body.friendid)
        .then((result) => response = "Friend Deleted Successfully")
        .catch((error) => { throw error; });
    await closeConnection(client)
    return res.send(response);
}
