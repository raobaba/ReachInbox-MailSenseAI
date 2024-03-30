"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require('mysql2/promise');
const dotenv = require('dotenv').config();
if (dotenv.error) {
    throw dotenv.error;
}
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } = process.env;
const Connection = mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: MYSQL_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
exports.default = Connection;
