import express, { Application } from "express";
import connectString from "./database/connection";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute";
dotenv.config();
const app: Application = express();
app.use(express.json());
connectString();
app.use("/", userRoute);
const PORT = Number(process?.env.PORT_NUMBER) || 3000;
app.listen(PORT, () => {
  console.log("server has started at port no 3000");
});
