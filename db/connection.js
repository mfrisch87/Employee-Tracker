const util = require("util");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    //port
    port: "3306",
    //sql user name
    user: "root",
    //sql password
    password: "password",
    //name of database
    database: "employee_DB"
});

connection.connect((err)=>{
    if(err) throw err;
    console.log("connect as id " + connection.threadId);
});
connection.query = util.promisify(connection.query);

module.exports = connection;