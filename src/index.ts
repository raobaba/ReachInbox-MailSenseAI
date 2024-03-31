import express, { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import gmailRouter from "./route/gmail.route";
import "./utils/googleAuth";
import Connection from "./config/config";
import openaiRouter from "./route/openai.route";
const app = express();
const PORT = process.env.PORT ;

app.set("view engine", "ejs");

app.use(express.json());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to Gmail API with NodeJS");
});

app.get("/auth/success", (req: Request, res: Response) => {
  res.send("You are successfully logged in");
});

app.get("/auth/failure", (req: Request, res: Response) => {
  res.send("Something went wrong");
});

(async () => {
  try {
    await Connection.getConnection();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

app.use("/", gmailRouter);
app.use("/api", openaiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
