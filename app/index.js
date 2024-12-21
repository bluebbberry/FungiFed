import express from 'express';
import cors from "cors";
import userController from "./src/controllers/user.controller.js";
import fungiController from "./src/controllers/fungi.controller.js";
import { FungiService } from "./src/services/fungi.service.js";
import notificationsController from "./src/controllers/notifications.controller.js";
import {FungiHistoryService} from "./src/services/fungi-history.service.js";
import {MycelialFungiHistoryService} from "./src/services/mycelial-fungi-history.service.js";

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
app.use('/notifications', notificationsController);

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

const fungiService = FungiService.fungiService;
fungiService.startFungiLifecycle();

const fungiHistoryService = FungiHistoryService.fungiHistoryService;
fungiHistoryService.startCheckingForUserFeedbackAndCalculateHistoryFitness();

const mycelialHistoryService = MycelialFungiHistoryService.mycelialFungiHistoryService;
mycelialHistoryService.startAggregatingMycelialData();
