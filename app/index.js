import express from 'express';
import cors from "cors";
import userController from "./src/controllers/user.controller.js";
import fungiController from "./src/controllers/fungi.controller.js";

// ============== REST API ===================
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/user', userController);
app.use('/fungi', fungiController);

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
