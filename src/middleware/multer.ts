import { Request } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  filename: (req: Request, file: Express.Multer.File, cb: any) => {
    const allowedFile = ["image/jpeg", "image/png"];
    if (allowedFile.includes(file?.mimetype)) {
      cb(null, Date.now() + " " + file.originalname);
    } else {
      cb(new Error("File type is not supported"));
    }
  },
});
export default storage;
