import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetproductsQuery } from "../slices/ProductApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Form ,Button } from "react-bootstrap";
import ProductCurousel from "../components/ProductCurousel";



      
      const Homescreen = () => {
  const { data: product, error, isLoading } = useGetproductsQuery();
  const [searchQuery, setSearchQuery] = useState('');

  

  const filteredProducts = product && product.filter(prod =>
    prod.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const handleSubmit = (e) => {
    e.preventDefault();
   // setSearchQuery('');

    
  };


  return (
    <> 


     <Form onSubmit={handleSubmit} className='d-flex'>
         <Form.Control
           type='text'
           placeholder='Search products...'
           style={{ height: '30px', width: '200px' }}
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)} />
     
        <Button type='submit' variant='primary'  className='p-0 mx-2'>Search</Button>
              
        </Form>

   <ProductCurousel/>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
        
          {filteredProducts && (
            <>
              <h1>Latest products</h1>
              <Row>
                {filteredProducts.map((prod) => (
                  <Col key={prod._id} sm={12} md={6} lg={4} xl={3}>
                    <Product prod={prod} />
                    
                  </Col>
                ))}
              </Row>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Homescreen;
