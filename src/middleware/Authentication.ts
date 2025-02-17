import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/UserSchema";
import { AuthRequest, UserType } from "../types/type";
dotenv.config();

class Authentication {
  handleAuthentication = async (
    req: AuthRequest, // Explicitly type req as AuthRequest
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("req.headers is", req.headers);
    const { token }: any = req.headers;

    if (!token) {
      res.status(401).json({
        message: "Oops! You seem to be a wrong guy",
      });
      return;
    }

    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      async (err: any, decoded: any): Promise<void> => {
        if (err) {
          res.status(401).json({
            message: "You are not allowed to use this service",
          });
          return;
        } else {
          const decodedData = await User.findOne({ _id: decoded?.id });

          if (!decodedData) {
            res.status(400).json({
              message: "No data is found for this id",
            });
            return;
          }

          const obj: UserType = {
            id: String(decodedData?._id),
            userName: decodedData?.userName || "",
            email: decodedData?.email || "",
          };

          req.user = obj; // Assign decoded user data to req.user
          next();
        }
      }
    );
  };
}

export default new Authentication();
