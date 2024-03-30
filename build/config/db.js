"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const connection = mysql_1.default.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "rajan123@",
    database: "rajan"
});
exports.default = connection;
