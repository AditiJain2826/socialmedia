
const { getConnection, closeConnection } = require('./dao/db-connection')
const jwt = require("jsonwebtoken");

exports.checkUser=async function (req,res,next){
    const data = jwt.verify(req.headers.auth_token,process.env.SECRETKEY)
    const client = await getConnection();
    await client.query("select * from profile where userid=" + data.userid)
    .then(async(result) =>{
        if(result.rows.length>0){
            await closeConnection(client)
            next()
        }else{
            await closeConnection(client)
            res.send("User doesnot exists")
        }

    })
    .catch((error) => { throw error; });
}