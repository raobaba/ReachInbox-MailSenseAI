"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const notificationQueue = new bullmq_1.Queue("email-queue");
async function init() {
    const res = await notificationQueue.add("Email to Rajan", {
        email: "shrikishunr7@gmal.com",
        subject: "Welcome Message",
        body: "Hey, Rajan Welcome"
    });
    console.log("Response", res.id);
}
init();
