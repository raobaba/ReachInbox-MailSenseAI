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
const app = (0, express_1.default)();
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
const PORT = process.env.PORT || 3000;
function isLogged(req, res, next) {
    if (req.user) {
        next();
    }
    else {
        res.sendStatus(403);
    }
}
app.set("view engine", "ejs");
app.use((0, express_session_1.default)({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
app.get("/", async (req, res) => {
    res.send("Welcome to Gmail API with NodeJS");
});
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
app.get("/auth/google/callback", passport_1.default.authenticate("google", {
    successRedirect: "/auth/success",
    failureRedirect: "/auth/failure",
    session: false
}));
app.get("/auth/success", isLogged, (req, res) => {
    res.send("You are successfully loggedIn");
});
app.get("/auth/failure", (req, res) => {
    res.send("Somethign went wrong");
});
app.use("/api", gmail_route_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
