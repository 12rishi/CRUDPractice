import { Request, Response } from "express";
import User from "../model/UserSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class Users {
  async LoginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      res.status(400).json({
        message: "please provide all the credential",
      });
    } else {
      const userData = await User.findOne({ email }).select("+password");
      if (!userData) {
        res.status(400).json({
          message: "no user have been found of this email",
        });
      } else {
        const checkPassword = bcrypt.compareSync(password, userData.password);
        if (!checkPassword) {
          res.status(400).json({
            message: "credentials did not match",
          });
        } else {
          const token = jwt.sign(
            { id: userData.id },
            process.env.SECRET_KEY as string,
            { expiresIn: "10d" }
          );
          res.status(200).json({
            message: "successfully login",
            token: token,
          });
        }
      }
    }
  }
  async RegisterUser(req: Request, res: Response): Promise<void> {
    const { userName, email, password } = req.body as {
      userName: string;
      email: string;
      password: string;
    };

    if (!userName || !email || !password) {
      res.status(400).json({
        message: "please provide all the credential",
      });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10 as number);
      await User.create({ userName, email, password: hashedPassword });
      res.status(200).json({
        message: "successfully stored the users data",
      });
    }
  }
}
export default new Users();
