import express from "express";
import cors from "cors";
import "dotenv/config";
import { initializeDb } from "./database/firestore.js";

import routes from "./routes/routes.js";

initializeDb();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
