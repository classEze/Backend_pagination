const mysql = require("mysql")

const db = mysql.createConnection({
    host:'localhost',
    database:'2022_04_06_dummy',
    user:'root',
    password:'password'
})

db.connect(function(err){
    if(err) return console.log("Error connecting to database: " + err.message );
    console.log("Database connection successfully established")
})

module.exports = db