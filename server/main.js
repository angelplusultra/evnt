/* eslint-disable import/extensions */
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import * as url from 'url';
import connectDb from './db/db.js';
import router from './routes/index.js';
import handleError from './middleware/handleError.js';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));

dotenv.config({ path: path.join(dirname, '/config/.env') });

const app = express();

connectDb();

app.use(express.json());

app.use(router);

app.use(handleError);

// eslint-disable-next-line no-console
app.listen(process.env.PORT, console.log(`Listening at ${process.env.PORT}`));
