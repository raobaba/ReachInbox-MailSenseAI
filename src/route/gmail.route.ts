import express, { Request, Response } from "express";
import controllers from "../controller/gmail.controller";
import passport from "passport";

const gmailRouter = express.Router();

gmailRouter.get("/mail/send", (req: Request, res: Response) =>
  controllers.sendMail(req, res)
);

gmailRouter.get("/mail/user/:email", (req: Request, res: Response) =>
  controllers.getUser(req, res)
);

gmailRouter.get("/mail/read/:email/:messageId", (req: Request, res: Response) =>
  controllers.readMail(req, res)
);

gmailRouter.get("/mail/list/:email", (req: Request, res: Response) =>
  controllers.getMails(req, res)
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
