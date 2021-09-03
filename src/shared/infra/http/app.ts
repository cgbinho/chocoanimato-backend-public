import 'reflect-metadata';
//import 'dotenv/config';
import { container } from 'tsyringe';
import { setQueues } from 'bull-board';
import { resolve } from 'path';
import { BullBoardQueues } from '../queue/queues';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import routes from './routes';
import rateLimiter from './middlewares/RateLimiter';
import AppError from '@shared/errors/AppError';
import appConfig from '@config/app';
import CreateConnection from '@shared/infra/typeorm';
import CreateUserAdminService from '@modules/users/services/CreateUserAdminService';
import '@shared/container';

/*
CREATE ADMIN
*/
const init = async () => {
  await CreateConnection();
  const createUserAdminService = container.resolve(CreateUserAdminService);
  await createUserAdminService.execute(appConfig.admin);
};

/*
INIT DB CONNECTION
*/
init();

// const createUserAdminService = container.resolve(CreateUserAdminService);
// await createUserAdminService.execute(appConfig.admin);

const app = express();
/*
SET QUEUES ON BULLBOARD:
*/
setQueues(BullBoardQueues());

const corsOptions = {
  // origin: `http://localhost:${4444}`,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  exposedHeaders: ['Content-Disposition']
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // support encoded bodies
// app.use(rateLimiter);
app.use(routes);

// Celebrate: (validation errors)
app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

export default app;
