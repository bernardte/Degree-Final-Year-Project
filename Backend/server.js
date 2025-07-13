import express from "express";
import fileupload from "express-fileupload"; //express-file
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connnectDB } from "./config/db.js";
import usersRoute from "./Routes/users.route.js";
import roomRoute from "./Routes/room.route.js";
import facilityRoute from "./Routes/facility.route.js";
import adminRoute from "./Routes/admin.route.js";
import bookingRoute from "./Routes/bookings.route.js";
import statisticRoute from "./Routes/statistic.route.js";
import refreshTokenRoute from "./Routes/refreshToken.route.js";
import checkoutRoute from "./Routes/checkout.route.js";
import eventRoute from "./Routes/event.route.js";
import rewardRoute from "./Routes/reward.route.js";
import systemSettingRoute from "./Routes/systemSetting.route.js";
import messageRoute from "./Routes/messages.route.js";
import conversationRoute from "./Routes/conversations.route.js";
import notificationRoute from "./Routes/notification.route.js";
import faqRouter from "./Routes/faq.route.js";
import bookingStatusUpdater from "./cronjob/bookingStatusUpdater.js";
import roomStatusScheduler from "./cronjob/roomStatusScheduler.js";
import { initializeSocket } from "./config/socket.js";
import { createServer } from "http"; //http server

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(
    fileupload({
        useTempFiles: true,
        tempFileDir: path.join(__dirname, "temp"),
        createParentPath: true,
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB
        },
    }
))

const httpServer = createServer(app);
initializeSocket(httpServer)

app.use("/api/users", usersRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/facilities", facilityRoute);
app.use("/api/admin", adminRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/statistic", statisticRoute);
app.use("/api/refreshToken", refreshTokenRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/event", eventRoute);
app.use("/api/reward", rewardRoute);
app.use("/api/systemSetting", systemSettingRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/faq", faqRouter);

httpServer.listen(PORT, async () => {
    console.log("Server is running on port", PORT);
    await connnectDB();
    bookingStatusUpdater.start();
    roomStatusScheduler.start();
})
