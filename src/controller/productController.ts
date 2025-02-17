import { response, Response } from "express";

import cloudinary from "../middleware/cloudinary";
import Product from "../model/ProductSchema";
import { AuthRequest } from "../types/type";

class ProductController {
  async addProduct(req: AuthRequest, res: Response): Promise<void> {
    const { productName, productPrice, productDetail } = req.body;

    if (!productName || !productPrice || !productDetail) {
      res.status(400).json({
        message: "provide all the details",
      });
    }
    if (!req.files || !req.files.length) {
      res.status(400).json({
        message: "no images has been uploaded",
      });
    }
    console.log(req.files);
    const uploadImages = await Promise.all(
      (req.files as Express.Multer.File[]).map(async (file) => {
        const cloudUpload = await cloudinary.v2.uploader.upload(file.path);
        console.log(cloudUpload);
        return {
          data: cloudUpload.url,
          contentType: file.mimetype,
          public_id: cloudUpload.public_id,
        };
      })
    );
    console.log(uploadImages);
    const productsDetail = await Product.create({
      productName,
      productPrice,
      productDetail,
      productImage: uploadImages,
    });
    res.status(200).json({
      message: "product created successfully",
      data: productsDetail,
    });
  }
  async getProduct(req: AuthRequest, res: Response): Promise<void> {
    const data = await Product.find();
    if (data.length <= 0) {
      res.status(400).json({
        message: "no product is found",
      });
    }
    res.status(200).json({
      message: "successfully fetched the product",
      data,
    });
  }
  async deleteProduct(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        message: "Oops,id is not available",
      });
    }
    const deleteProduct = await Product.findById({ _id: id });
    if (!deleteProduct) {
      res.status(404).json({
        message: "no data found for this id",
      });
    }
    const deleteImages: any = deleteProduct?.productImage.map(
      (val) => val.public_id
    );
    const deleteResults = await Promise.all(
      deleteImages.map((public_id: any) =>
        cloudinary.v2.uploader.destroy(public_id)
      )
    );
    console.log("deletResult is", deleteResults);
    await Product.findByIdAndDelete({ _id: id });
    res.status(204).json({
      message: "successfully deleted",
    });
  }
}
export default new ProductController();
