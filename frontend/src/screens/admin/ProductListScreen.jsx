import React from 'react'
import { useGetproductsQuery } from '../../slices/ProductApiSlice'
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Table ,Button ,Row , Col } from 'react-bootstrap';
import {FaEdit ,FaTrash } from 'react-icons/fa';
import {LinkContainer} from 'react-router-bootstrap'
import { useAddproductMutation ,useDeleteProductMutation} from '../../slices/ProductApiSlice';
import {toast} from 'react-toastify'


const ProductListScreen = () => {
    const { data: product, error, isLoading ,refetch} = useGetproductsQuery();
    const [saveproduct ,{isLoading:loadindaddproduct}] =useAddproductMutation();
    const [deleteProduct ,{isLoading:loadindDelete}] =useDeleteProductMutation()


    if(saveproduct){
        console.log(saveproduct)
    }

    const deleteHandler =async(id) =>{

        if(window.confirm('Are you sure want to delete product')){

            try {
                 await deleteProduct(id);
                
                refetch();
                toast.success('product deleted');
                
                   
               } catch (err) {
                toast.error(err?.data?.Message || err.error);
                   
               }
        }
        

    }

    // //craate new product handler
    const addproductHandler =async() =>{
    

        if(window.confirm('Are you sure you want to create a prodcut')){

            try {
                await saveproduct()
                refetch()
                toast.success('product created')

            } catch (err) {
                console.log('this is error' ,err)
                toast.error(err?.data?.Message || err.error)
                
            }
        }
    }

  return (
    <>
    <Row className='align-items-center'>

        <Col>
        <h1>Products</h1>
        </Col>

        <Col className='text-end'>
            
            <Button className='btn=sm m-3'  onClick={addproductHandler}><FaEdit/> Create product</Button>
            
        <LinkContainer to={'/admin/addproduct'}>
        <Button>Add product</Button>
        </LinkContainer>
            
        </Col>
        

    </Row>

    {loadindaddproduct && <Loader/>}
    {loadindDelete && <Loader/>}



    {isLoading ?(<Loader/>):error?(<Message variant='danger'>{error}</Message>):(
        <> 
    <Table striped hover responsive className='table-sm'>
        <thead>
            <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {product.map((item) =>(
                <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.category}</td>
                    <td>{item.brand}</td>
                    <td>
                       <LinkContainer to={`/admin/product/${item._id}/edit`}>  
                       <Button variant='light' className='btn-sm-mx-2'>
                        <FaEdit/>
                       </Button>
                       </LinkContainer>
                    </td>

                    <td>
                     
                       <Button variant='danger' className='btn-sm-mx-2 ' onClick={()=>deleteHandler(item._id)} >
                        <FaTrash style={{color:'white'}}/>
                       </Button>
                       
                    </td>
                </tr>
            ))}
        </tbody>

    </Table>
    </>
    
    )}
    </>
  )
}

export default ProductListScreen