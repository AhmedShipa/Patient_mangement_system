process.on("uncaughtException", (err) => {
  console.log(`error in code`, err);
});
import express from "express";
import { dbConnection } from "./dbConnection/dbConnection.js";
import { globalError } from "./src/middelware/global.js";
import { AppError } from "./src/middelware/appError.js";
import bootstrap from "./src/bootstrap/bootstrap.js";
import cors from "cors";
import dotenv from "dotenv"

dotenv.config()
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

bootstrap(app);
// catch unhandled error
app.use("*", (req, res, next) => {
  next(new AppError(`route not found ${req.originalUrl}`));
});

// handling error outside express
process.on("uncaughtException", (err) => {
  console.log(`error in code`, err);
});
``;

// error handling error
app.use(globalError);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
