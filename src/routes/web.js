import express from 'express';
import homepageController from '../controller/homepageController';
import chatbotController from '../controller/chatbotController';

const router = express.Router();

const initWebRoutes = app => {

    router.get("/", homepageController.getHomepage);

    router.get("/webhook", chatbotController.getWebhook);

    router.post("/webhook", chatbotController.postWebhook);

    return app.use("/", router);
};

module.exports = initWebRoutes;