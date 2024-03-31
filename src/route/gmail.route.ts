import express, { Request, Response } from "express";
import { sendMail, getMails } from "../controller/gmail.controller";
import passport from "passport";

const gmailRouter = express.Router();

gmailRouter.get("/mail/send", (req: Request, res: Response) =>
  sendMail(req, res)
);

gmailRouter.get("/mail/list/:email", (req: Request, res: Response) =>
  getMails(req, res)
);

gmailRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

gmailRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/success",
    failureRedirect: "/auth/failure",
    session: false,
  })
);

export default gmailRouter;
