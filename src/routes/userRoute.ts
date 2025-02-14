import express, { Router } from "express";
import Users from "../controller/userController";
import handleError from "../services/errorhandling";
const router: Router = express.Router();
router.route("/login").post(handleError(Users.LoginUser));
router.route("/register").post(handleError(Users.RegisterUser));
export default router;
