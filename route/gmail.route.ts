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

gmailRouter.get("/mail/read/:email/:messageId", (req: Request, res: Response) =>
  controllers.readMail(req, res)
);

gmailRouter.get("/mail/list/:email", (req: Request, res: Response) =>
  controllers.getMails(req, res)
);

export default gmailRouter;
