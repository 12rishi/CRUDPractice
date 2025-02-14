import { Request, Response } from "express";
import User from "../model/UserSchema";
import bcrypt from "bcrypt";

class Users {
  async LoginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      res.status(400).json({
        message: "please provide all the credential",
      });
    } else {
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
