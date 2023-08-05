const mysql = require('mysql2/promise')
const Pool=mysql.Pool
require('dotenv').config()


const pool=mysql.createPool({
    user:process.env.USERNAME,
    password:process.env.PASSWORD,
    host:process.env.HOST,
    port:process.env.DBPORT,
    database:'todoapp'
})
module.exports=pool