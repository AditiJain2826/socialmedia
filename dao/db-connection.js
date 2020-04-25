const { Client } = require('pg')
const MongoClient = require('mongodb').MongoClient

// get PG Connection
exports.getConnection = async () => {

    let client = new Client({
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.PORT
    });
    await client.connect(function (err) {
        if (err) {
            console.error('could not connect to postgres', err);
            client = null;
        }
        else {
            console.log('connected')
        }
    });
    return client;
}

// Close PG Connection
exports.closeConnection = async (client) => {
    client.end();
}

//Get Mongo Connection
exports.getMongoConnection = async () => {

    let db = null;
    const url = process.env.MONGOURL
    const client = new MongoClient(url, { useNewUrlParser: true ,useUnifiedTopology: true});
    await client.connect()
    db = await client.db("test")
    return db;
    
}

