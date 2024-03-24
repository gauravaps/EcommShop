import productmodel from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js"; 
import { customError } from "../middleware/apierror.js";


//add product
//post method
// private admin route only
//api/adminproduct/addproduct
const createProduct = asyncHandler(async (req, res, next) => {
  

    const addproduct = new productmodel({
      user:req.activeUser._id,
      name: "sample",
      image: "/images/flikart.png",
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
        
        product.brand=brand;
        product.image=image;
        product.category=category;
        product.description=description;
        product.price=price;
        product.countInstock=countInstock;

      //   if(req.file) {
      //     product.image = req.file.path;
      // }

        const updateProduct =await product.save();
        res.status(200).json(updateProduct);
    }else{
        let err = new customError('Resource not found' ,404)
        return next(err);
    }
    
  })


  //add product by other functionality
  //post method
  //api/adminproduct/addproductbutton
const addProductButton =asyncHandler(async(req ,res ,next) =>{

try {
  
      const {name ,brand ,category , description ,numReviews,price,countInstock} =req.body;
      const image = req.file.filename;
  
      const addnewproduct = new productmodel({
        user:req.activeUser._id,
        name,
        image,
        brand,
        category,
        description,
        numReviews,
        price,
        countInstock,
  
   
      });
        
    const saveproduct = await addnewproduct.save();
    res.status(200).json({ status: 0, message: 'Product added successfully', saveproduct });

} catch (err) {
  console.log(err)
  let error = new customError('Add product failed', 404);
   return next(error);
  
}
    

  })


  //DELETE PRODCUT
  //DELETE METHOD
  //ADMIN ACCESS
  //API/ADMINPRODUCT/DELTE

  const deleteProduct =asyncHandler(async(req ,res ,next) =>{
    const findProduct =await productmodel.findById(req.params.id);

    if (findProduct) {
      await findProduct.deleteOne({_id:findProduct._id})
      res.status(200).json({message:'product deleted'})
      
    }else{
      let err = new customError('NO product found to delete ', 404);
      return next(err)
    }
  })



  


  


  export { createProduct ,updateProduct ,addProductButton ,deleteProduct};
