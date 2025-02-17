import express, { Application } from "express";
import connectString from "./database/connection";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import cors from "cors";
import { sanitize } from "./middleware/SanitizeHtml";
dotenv.config();
const app: Application = express();
app.use(
  cors({
    origin: ["http://localhost:3000/"],
    allowedHeaders: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "UPDATE",
      "PATCH",
      "OPTIONS",
    ],
  })
);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

connectString();
app.use(sanitize);
app.use("/", userRoute);
app.use("/", productRoute);
const PORT = Number(process?.env.PORT_NUMBER) || 3000;
app.listen(PORT, () => {
  console.log("server has started at port no 3000");
});
