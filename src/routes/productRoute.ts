import express, { Router, Request, Response, NextFunction } from "express";
import { limitRate } from "../middleware/rateLimit";
import handleError from "../services/errorhandling";
import Authentication from "../middleware/Authentication";
import productController from "../controller/productController";
import multer from "multer";
import storage from "../middleware/multer";
import { AuthRequest } from "../types/type";

const router: Router = express.Router();
const upload = multer({ storage: storage });

router
  .route("/product")
  .post(
    limitRate,
    (req: Request, res: Response, next: NextFunction) => {
      Authentication.handleAuthentication(req as AuthRequest, res, next);
    },
    upload.array("image"),
    handleError(productController.addProduct)
  )
  .get((req: Request, res: Response, next: NextFunction) => {
    Authentication.handleAuthentication(req as AuthRequest, res, next);
  }, handleError(productController.getProduct));

router.route("/product/:id").delete(
  limitRate,
  (req: Request, res: Response, next: NextFunction) => {
    Authentication.handleAuthentication(req as AuthRequest, res, next);
  },
  handleError(productController.deleteProduct)
);

export default router;
