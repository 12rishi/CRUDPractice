import { response, Response } from "express";

import cloudinary from "../middleware/cloudinary";
import Product from "../model/ProductSchema";
import { AuthRequest } from "../types/type";
import getCache from "../middleware/Redis";

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
      userId: req.user.id,
    });
    res.status(200).json({
      message: "product created successfully",
      data: productsDetail,
    });
  }
  async getProduct(req: AuthRequest, res: Response): Promise<void> {
    const getProduct = await getCache("getProduct", async () => {
      const data = await Product.find().populate("userId").exec();
      if (data.length <= 0) {
        throw new Error("There are no products");
      }
      return data;
    });
    res.status(200).json({
      message: "successfully fetched all data",
      data: getProduct,
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
  async updateProduct(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { productName, productPrice, productDetail } = req.body;
    if (!id) {
      res.status(400).json({
        message: "please provide an id",
      });
    }

    if (req.files) {
      const data = await Product.findById({ _id: id });
      if (data?.productImage?.length) {
        const dataImage = data.productImage.map((val) => val.public_id);

        await Promise.all(
          dataImage.map((val: any) => cloudinary.v2.uploader.destroy(val))
        );
        const updateImages = await Promise.all(
          (req.files as Express.Multer.File[]).map(async (val) => {
            const imageData = await cloudinary.v2.uploader.upload(val.path);
            return {
              data: imageData.url,
              contentType: val.mimetype,
              public_id: imageData.public_id,
            };
          })
        );
        const updateData = Product.findByIdAndUpdate(
          { _id: id },
          {
            productName,
            productPrice,
            productDetail,
            productImage: updateImages,
          }
        );
        res.status(200).json({
          message: "updated successfully",
          data: updateData,
        });
        return;
      }
      const updateData = Product.findByIdAndUpdate(
        { _id: id },
        { productName, productDetail, productPrice }
      );
      res.status(200).json({
        message: "updated successfully",
        data: updateData,
      });
    }
  }
}
export default new ProductController();
