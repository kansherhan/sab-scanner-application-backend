import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRouter from "./routers/auth.router.js";
import siteRouter from "./routers/site.router.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all("/", (request, response) => response.send("Hello, World!"));

app.use("/auth", authRouter);
app.use("/site", siteRouter);

app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Сервер запустился на порту ${process.env.BACKEND_PORT}`);
});
