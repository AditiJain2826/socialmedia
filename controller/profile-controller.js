const { getConnection, closeConnection, getMongoConnection } = require('../dao/db-connection')
const jwt = require("jsonwebtoken");

// Get profile details
exports.getProfile = async function (req, res, next) {
    const client = await getConnection();
    let response = null;
    if (client) {
        await client.query("select * from profile where userid=" + req.user[0].userid)
            .then((result) => response = (result.rows))
            .catch((error) => { throw error; });
        await closeConnection(client)
        return res.send(response);
    } else {
        return res.send("Something went wrong");
    }
}

// Add new Profile
exports.addProfile = async function (req, res, next) {
    const client = await getConnection();
    let response = null;
    const { name, bio, gender, phoneno, password } = req.body
    await client.query(`insert into profile (name, bio, gender, phoneno,password) VALUES ('${name}','${bio}','${gender}',${phoneno},'${password}') returning userid`)
        .then((result) => {
            response = "Profile with userid " + result.rows[0].userid + " added successfully "
        })
        .catch((error) => { throw error; });
    await closeConnection(client)
    return res.send(response);
}

//Update Profile
exports.updateProfile = async function (req, res, next) {
    const client = await getConnection();
    let response = null;
    let token
    let pwd
    await client.query("select password from profile where userid=" + req.user[0].userid).then((res) => pwd = res.rows[0].password)
    await client.query("Update profile set name= '" + req.body.name + "' ,bio= '" + req.body.bio +
        "' ,gender= '" + req.body.gender + "' ,phoneno= " + req.body.phoneno + " ,password = '" + req.body.password + "' where userid=" + req.user[0].userid)
        .then(async (result) => {
            response = "Profile updated Successfully"
            if (pwd !== req.body.password) {
                token = await jwt.sign({ userid: req.body.userid }, process.env.SECRETKEY);
            }

        })
        .catch((error) => { throw error; });
    await closeConnection(client)

    return res.send({ response, token });
}

//Delete profile
exports.deleteProfile = async function (req, res, next) {
    const client = await getConnection();
    let response = null;
    if (client) {

        await client.query("delete from profile where userid=" + req.user[0].userid)
            .then(async (result) => {
                response = "Deleted Successfully"
            })
            .catch((error) => { throw error; });
        await closeConnection(client)
        return res.send(response);
    } else {
        return res.send("Something went wrong");
    }
}