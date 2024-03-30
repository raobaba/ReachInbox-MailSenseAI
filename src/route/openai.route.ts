import express, { Router } from 'express';
import { getResponse } from '../controller/openai.controller';

const openaiRouter: Router = express.Router();

openaiRouter.post('/getResponse', getResponse);

export default openaiRouter;
