"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const events_1 = require("events");
const gmail_route_1 = __importDefault(require("./route/gmail.route"));
require("./utils/googleAuth");
const config_1 = __importDefault(require("./config/config"));
const openai_route_1 = __importDefault(require("./route/openai.route"));
const app = (0, express_1.default)();
const cron = require('node-cron');
const PORT = process.env.PORT;
events_1.EventEmitter.setMaxListeners(15);
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get("/", async (req, res) => {
    res.send("Welcome to Gmail API with NodeJS");
});
app.get("/auth/success", (req, res) => {
    res.send("You are successfully logged in");
});
app.get("/auth/failure", (req, res) => {
    res.send("Something went wrong");
});
(async () => {
    try {
        await config_1.default.getConnection();
        console.log("Connected to the database");
    }
    catch (error) {
        console.error("Database connection error:", error);
    }
})();
app.use("/", gmail_route_1.default);
app.use("/api", openai_route_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
