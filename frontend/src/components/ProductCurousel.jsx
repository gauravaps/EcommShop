import React from 'react'
import { useGetTopproductsQuery } from '../slices/ProductApiSlice'
import { Carousel,Image } from 'react-bootstrap'
import Loader from './Loader'
import Message from './Message'

import { Link } from 'react-router-dom'

const ProductCurousel = () => {
   
    const {data:getTopproducts ,isLoading ,error} =useGetTopproductsQuery()
  
    return (
    isLoading ? null :error? <Message variant='danger'>{error}</Message>:(
        <Carousel pause='hover' style={{width:'500px'}} className='slice' >
            {getTopproducts.map(item =>(
                <Carousel.Item key={item._id}><br></br>
                    <Link to={`/product/${item._id}`}>
                        <Image src={`/uploads/${item.image}`} alt={item.name}  
                         fluid/>
                        <Carousel.Caption className='carousel-caption'>
                            <h2 className='text-white text-right'>{item.name} ({item.price})</h2>

                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}

        </Carousel>
    )
  )
}

export default ProductCurousel