import express from "express";
import { test, parseFungiCode } from "../services/fungi.service.js"

const router = express.Router();

router.get("/", async (request, response) => {
    response.status(200).json({ responseBody: {
        "test": test()
    }});
});

router.post("/", async (request, response) => {
    const fungiCode = JSON.stringify(request.body);
    const success = parseFungiCode(fungiCode);
    response.status(200).json({ responseBody: success });
});

export default router;
