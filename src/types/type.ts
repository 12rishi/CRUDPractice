import { Request } from "express";

export interface UserType {
  id: string | null;
  userName: string;
  email: string;
}
export interface AuthRequest extends Request {
  user: UserType;
}
