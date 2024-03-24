import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useGetsingleProductQuery ,useEditProductMutation ,
        useUploadProductImageMutation } from '../../slices/ProductApiSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FormContainer } from '../../components/FormContainer';
import { Form, Button} from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';


const ProductEditScreen = () => {
    const { id:productId } = useParams();
    const { data:product, refetch,error, isLoading } = useGetsingleProductQuery(productId);
    const [editProduct ,{isLoading:loadingeditproduct}] =useEditProductMutation()
    const [uploadProductImage,{isLoading:loadingimage}] =useUploadProductImageMutation();

    const navigate =useNavigate()


    const [name ,setname] =useState('');
    const [brand ,setbrand] =useState('');
    const [image ,setimage] =useState('')
    const [category ,setcategory] =useState('');
    const [description ,setdescription] =useState('');
    const [price,setprice] = useState(0);
    const [countInstock ,setcountInstock] =useState(0)

    useEffect(()=>{
        if(product){
            setname(product.name);
            setbrand(product.brand);
            setimage(product.image)
            setcategory(product.category);
            setdescription(product.description);
            setprice(product.price);
            setcountInstock(product.countInstock);
        }

    },[product])


 // Edit product handler   
    const submitHandler =async(e) =>{
        e.preventDefault();
        const updateProduct ={
            _id:productId, name,image, brand, category, description, price, countInstock
        }
        
        
        const result =await editProduct(updateProduct);

        if(result.error){
            toast.error(result.error)
        }else{
            toast.success('Product updates')
            refetch()
            navigate('/admin/productlist')
        }
    }


// upload file image
    const uploadfileHandler = async (e) => {
        const pic =e.target.files[0];
        console.log(pic);
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
    
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            let newpic =res.image;
            let cropimage =newpic.replace("uploads\\" ,"");
            
            setimage(cropimage);
            
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }
    

  return (
    <>
    <Link to={'/admin/productlist'} className='btn btn-light my-3'>Go Back</Link>

    <FormContainer>
        <h1>Edit product</h1>
        {loadingeditproduct && <Loader/>}

        {isLoading ?(<Loader/>) :error ?(<Message variant='danger'>{error}</Message>):(
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-2'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text' placeholder='Enter name' value={name}
                    onChange={(e) =>setname(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='price' className='my-2'>
                    <Form.Label>Price</Form.Label>
                    <Form.Control type='number' placeholder='Enter price' value={price}
                    onChange={(e) =>setprice(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='image' className='my-2'>
                    <Form.Label>image</Form.Label>
                     <Form.Control type='text' placeholder='Enter image url' value={image}
                    onChange={(e) =>setimage}
                    ></Form.Control> 
                    <Form.Control type='file' Label='choose file' onChange={uploadfileHandler}></Form.Control>
                </Form.Group>
                {loadingimage &&<Loader/>}

                <Form.Group controlId='brand' className='my-2'>
                    <Form.Label>Brand</Form.Label>
                    <Form.Control type='text' placeholder='Enter Brand name' value={brand}
                    onChange={(e) =>setbrand(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='category' className='my-2'>
                    <Form.Label>Category</Form.Label>
                    <Form.Control type='text' placeholder='Enter category' value={category}
                    onChange={(e) =>setcategory(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                
                <Form.Group controlId='description' className='my-2'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control type='text' placeholder='Enter Description' value={description}
                    onChange={(e) =>setdescription(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                
                <Form.Group controlId='countInstock' className='my-2'>
                    <Form.Label>CountInstock</Form.Label>
                    <Form.Control type='number' placeholder='Enter Description' value={countInstock}
                    onChange={(e) =>setcountInstock(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' className='my-2'>
                    Update
                </Button>

            </Form>
        )}

    </FormContainer>
    </>
  )
}

export default ProductEditScreen;