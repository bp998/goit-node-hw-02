import express from "express";
import logger from "morgan";
import cors from "cors";
import setJWTStrategy from "./config/jwt.js";
import { startServer } from "./server.js";
import contactsRouter from "./routes/api/contactsRouter.js";
import usersRouter from "./routes/api/usersRouter.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

setJWTStrategy();

app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);
app.use("/avatars", express.static("public/avatars"));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

startServer();

export default app;
