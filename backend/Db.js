const mongoose = require('mongoose')
require('dotenv').config();
const DbHOST=process.env.DBHOST;
// console.log(Db)
connectToMongo().catch(err => console.log(err))
// console.log(DBHOST)cl
async function connectToMongo() {
    await mongoose.connect(DbHOST)
    console.log("connected succesfully")
}
module.exports = connectToMongo;