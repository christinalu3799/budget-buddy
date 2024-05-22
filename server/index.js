import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import usersRoutes from './routes/usersRoutes.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: `http://localhost:${PORT}/`,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    })
);

app.get('/', (req, res) => {
    console.log(req);
    return res.status(200).send('Welcome');
});

app.use('/users', usersRoutes);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('Successfully connected to database.');
        app.listen(PORT, () => {
            console.log(`Listening to port: ${PORT} 🎧 `);
        });
    })
    .catch((error) => {
        console.log(error);
    });
