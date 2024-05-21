import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './models/User.js';

const app = express();

app.use(express.json());
app.get('/', (req, res) => {
    console.log(req);
    return res.status(200).send('Welcome');
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return response.status(400).send({
                message: 'Missing required fields.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).send(newUser);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

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
