import productmodel from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js"; 
import { customError } from "../middleware/apierror.js";


//add product
//post method
// private admin route only
//api/product/addproduct
const createProduct = asyncHandler(async (req, res, next) => {
  

    const addproduct = new productmodel({
      user:req.activeUser._id,
      name: "sample",
      image: "/images/nikes.jpg",
      brand:'sample',
      category:'sample',
      description:'sample',
      numReviews:0,
      price:0,
      countInstock:0,
    });
  
    const saveproduct =await addproduct.save();

    res.status(201).json(saveproduct)
  });

  // access admin 
  //put method
  //update product
  const updateProduct =asyncHandler(async(req ,res ,next) =>{

    const {name,image,brand,category,description,price ,countInstock} =req.body ;

    const product = await productmodel.findById(req.params.id);

    if(product){
        product.name=name;
        product.image=image;
        product.brand=brand;
        product.category=category;
        product.description=description;
        product.price=price;
        product.countInstock=countInstock;

        const updateProduct =await product.save();
        res.status(200).json(updateProduct);
    }else{
        let err = new customError('Resource not found' ,404)
        return next(err);
    }
    
  })








  


  export { createProduct ,updateProduct};
