"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const gmail_route_1 = __importDefault(require("./route/gmail.route"));
require("./utils/googleAuth");
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("./config/config"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.set("view engine", "ejs");
app.use(express_1.default.json());
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
app.get("/getResponse", async (req, res) => {
    const userPrompt = req.body.userPrompt;
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userPrompt }],
        max_tokens: 100,
    });
    res.send(response.choices[0].message.content);
});
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
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
app.get("/auth/google/callback", passport_1.default.authenticate("google", {
    successRedirect: "/auth/success",
    failureRedirect: "/auth/failure",
    session: false,
}));
app.get("/auth/success", (req, res) => {
    res.send("You are successfully logged in");
});
app.get("/auth/failure", (req, res) => {
    res.send("Something went wrong");
});
(async () => {
    try {
        await config_1.default.getConnection();
        console.log('Connected to the database');
    }
    catch (error) {
        console.error('Database connection error:', error);
    }
})();
app.use("/api", gmail_route_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
