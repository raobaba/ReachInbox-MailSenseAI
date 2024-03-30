import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } = process.env;

const Connection: Pool = mysql.createPool({
  host: MYSQL_HOST!,
  user: MYSQL_USER!,
  password: MYSQL_PASSWORD!,
  database: MYSQL_DATABASE!,
  port: parseInt(MYSQL_PORT!),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default Connection;
