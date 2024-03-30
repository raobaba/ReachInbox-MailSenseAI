"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gmail_route_1 = __importDefault(require("./route/gmail.route"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: ["somesessionkey"],
    maxAge: 24 * 60 * 60 * 100,
}));
app.get('/', async (req, res) => {
    res.send('Welcome to Gmail API with NodeJS');
});
app.use('/api', gmail_route_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
