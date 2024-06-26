import React, { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Product from "../components/Product";
import { useGetproductsQuery } from "../slices/ProductApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Form } from "react-bootstrap";
import ProductCurousel from "../components/ProductCurousel";
import salepic from './supersale.jpg';
import newsale from './manwoman.jpg';

const Homescreen = () => {
  const { data: product, error, isLoading } = useGetproductsQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const filteredProducts = product && product.filter(prod =>
    prod.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // setSearchQuery('');
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);

    //setCurrentPage(currentPage+1);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts && filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const previousProducts = filteredProducts && filteredProducts.slice(0, indexOfFirstProduct);

  return (
    <> 
    <div class="wraper">
        <p className="p">SALE IS LIVE</p>
        <p  className="p">100% GENUINE BRANDS</p>
        <p  className="p">LATEST LAUNCHES</p>
        <p  className="p">PREMIUM FINDS</p>
        <p  className="p">HURRY UP!</p>

    </div>
    


      <Form onSubmit={handleSubmit} className='d-flex p-2'>
         <Form.Control
           type='text'
           placeholder='Search products...'
           style={{ height: '30px', width: '200px' }}
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)} />
     
        <Button type='submit' variant='primary'  className='p-0 mx-2'>Search</Button>
        
      </Form> 

      <div className="saleimage"> 

      <img src={newsale} alt="saleimagenotfound" 

       />
      </div>

      <ProductCurousel/>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>Latest products</h1>
          <Row>
            {previousProducts && previousProducts.map((prod) => (
              <Col key={prod._id} sm={12} md={6} lg={4} xl={3}>
                <Product prod={prod} />
              </Col>
            ))}
            {currentProducts && currentProducts.map((prod) => (
              <Col key={prod._id} sm={12} md={6} lg={4} xl={3}>
                <Product prod={prod} />
              </Col>
            ))}
          </Row>
          <Button disabled={currentProducts.length < productsPerPage} onClick={handleNextPage}>Next</Button> 

        </>
      )}
    </>
  );
};

export default Homescreen;
