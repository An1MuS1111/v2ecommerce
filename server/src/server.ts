import express from 'express';
import cors from 'cors';

const app = express();


app.use(cors());
app.use(express.json());

import {router as authsRouter, DatabaseConnection}  from './routes/auths';
app.use('/auths', authsRouter);

// Define the server port
const PORT: number = 4444;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
