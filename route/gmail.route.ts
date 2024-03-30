import express from "express";
import { Request, Response } from "express";
import * as controllers from "../controller/gmail.controller";

const gmailRouter = express.Router();

gmailRouter.get("/mail/send", (req: Request, res: Response) =>
  controllers.sendMail(req, res)
);

gmailRouter.get("/mail/user/:email", (req: Request, res: Response) =>
  controllers.getUser(req, res)
);

export default gmailRouter;
