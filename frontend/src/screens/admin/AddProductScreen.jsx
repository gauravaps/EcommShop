import React, { useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import {toast} from 'react-toastify'


const AddProductScreen = () => {
  
  const [name ,setname] =useState('');
  const [brand ,setbrand] =useState('');
  const [image ,setimage] =useState('')
  const [category ,setcategory] =useState('');
  const [description ,setdescription] =useState('');
  const [numReviews ,setnumReviews] =useState(0)
  const [price,setprice] = useState(0);
  const [countInstock ,setcountInstock] =useState(0)


  
  // Function to reset all input fields
  const resetFormFields = () => {
    setname('');
    setbrand('');
    setimage('');
    setcategory('');
    setdescription('');
    setnumReviews(0);
    setprice(0);
    setcountInstock(0);
  };

  //file handel change or picture..s
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setimage(file); // Set the file to state
  };





const handleSubmit =async(e) =>{
  e.preventDefault();

  try {
    const formData = new FormData(); // Create form data object
  
    formData.append('name',name);
    formData.append('brand' ,brand);
    formData.append('image' ,image);
    formData.append('category' ,category);
    formData.append('description' ,description);
    formData.append('numReviews' ,numReviews);
    formData.append('price',price);
    formData.append('countInstock' ,countInstock);
  
    const response = await axios.post('/api/adminproduct/addproductbutton' ,formData)
  
    // if user registration successfull or failed..
        if (response.data) {
          //alert("User registered successfull");
          resetFormFields();
          toast.success('Product created successfully')
          
        } else {
          //alert("user registration failed !!");
          toast.error('Failde to add product')
        }
  
  
  } catch (error) {
    
    console.log(error);
    console.error("Error creating product:", error.message);
    
  }

}







  return (
    <div className='prodiv'>
          <Link to={'/admin/productlist'} className='btn btn-light my-3'>Go Back</Link>

      <div className='prodiv'>

      <h2 className='proh5'>
        <span>Add New Product</span>
    </h2>
     </div>

     <form className='proform' action="" onSubmit={handleSubmit}>

      <div className='prodiv2'>
        <label className='prolab'>NAME</label>
        <input className='proinput' type="text" placeholder='Enter product name' name='name'
        value={name} onChange={(e)=>setname(e.target.value)}
        />
      </div>

      
      <div className='prodiv2'>
        <label className='prolab'>BRAND</label>
        <input className='proinput' type="text" placeholder='Enter brand name' name='brand'
        value={brand} onChange={(e) =>setbrand(e.target.value)}
        />
      </div>

      
      <div className='prodiv2'>
        <label className='prolab'>IMAGE</label>
        <input className='proinput' type="file"  name='image'
         onChange={handleFileChange}
        />
      </div>

      
      <div className='prodiv2'>
        <label className='prolab'>CATEGORY</label>
        <input className='proinput' type="text" placeholder='Enter category name'
        name='category' value={category} onChange={(e) =>setcategory(e.target.value)}
        />
      </div>

      
      <div className='prodiv2'>
        <label className='prolab'>DESCRIPTION</label>
        <textarea  className='proinput'
         name="description" 
         value={description}
         onChange={(e) =>setdescription(e.target.value)}
         rows="2" cols="25">
         </textarea>
      </div>

      
      <div className='prodiv2'>
        <label className='prolab'> REVIEWS</label>
        <input className='proinput' type="number" placeholder='Enter product name'
        value={numReviews} name='numReviews' onChange={(e) =>setnumReviews(e.target.value)}
        />
      </div>

      
      <div className='prodiv2'>
        <label className='prolab'>PRICE</label>
        <input className='proinput' type="number" placeholder='Enter product name'
        value={price} name='price' onChange={(e) =>setprice(e.target.value)}
        />
      </div>

      
      <div className='prodiv2'>
        <label className='prolab'>COUNT IN STOCK</label>
        <input className='proinput' type="number" placeholder='Enter product name'
        value={countInstock} name='countInstock' onChange={(e) =>setcountInstock(e.target.value)} 
        />
      </div>

      <button className='probtn' type='submit'>ADD PRODUCT</button>



     </form>

    </div>
  )
}

export default AddProductScreen; 