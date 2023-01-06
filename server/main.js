/* eslint-disable import/extensions */
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import * as url from 'url';
import cors from 'cors';
import connectDb from './db/db.js';
import router from './routes/index.js';
import handleError from './middleware/handleError.js';

// eslint-disable-next-line import/prefer-default-export
export const dirname = url.fileURLToPath(new URL('.', import.meta.url));

dotenv.config({ path: path.join(dirname, '/config/.env') });

const app = express();

app.use(cors());

connectDb();

app.use(express.json());

app.use(router);

app.use(handleError);

// eslint-disable-next-line no-console
app.listen(process.env.PORT, console.log(`Listening at ${process.env.PORT}`));
