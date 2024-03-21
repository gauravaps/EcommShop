import productmodel from "../models/productModel.js";
import dbconnect from "../config/db.js";
import dotenv from "dotenv";
import asyncHandler from "../middleware/asyncHandler.js";
import { customError } from "../middleware/apierror.js";



dbconnect();
dotenv.config();

//get all products
//public route
const getallproduct = asyncHandler(async (req, res, next) => {
  const allproduct = await productmodel.find({});

  return res.json(allproduct);
});


//get single prodcut by Id
//public route
const getsingleProduct = asyncHandler(async (req, res, next) => {
  const singleproduct = await productmodel.findById(req.params.id);

  if (!singleproduct) {
    const err = new customError("Resource not found", 404);
    return next(err);
  }
  res.json(singleproduct);
});










export { getallproduct, getsingleProduct };
