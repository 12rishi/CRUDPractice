import express, { Router } from "express";
import Users from "../controller/userController";
import handleError from "../services/errorhandling";
import { sanitize } from "../middleware/SanitizeHtml";
import { limitRate } from "../middleware/rateLimit";
const router: Router = express.Router();
router.route("/login").post(limitRate, handleError(Users.LoginUser));
router.route("/register").post(limitRate, handleError(Users.RegisterUser));
export default router;
