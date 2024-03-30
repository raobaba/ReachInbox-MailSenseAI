import express, { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import gmailRouter from "./route/gmail.route";
import "./utils/googleAuth";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

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

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/success",
    failureRedirect: "/auth/failure",
    session: false 
  })
);

app.get("/auth/success", (req: Request, res: Response) => {
    res.send("You are successfully logged in");
  });
  
  app.get("/auth/failure", (req: Request, res: Response) => {
    res.send("Something went wrong");
  });

app.use("/api", gmailRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
