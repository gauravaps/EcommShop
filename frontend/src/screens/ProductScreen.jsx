import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Image, Col, ListGroup, Row, Button, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import { useGetsingleProductQuery } from "../slices/ProductApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/CartSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductScreen = () => {
  const { id } = useParams();
  const [qty ,setqty] = useState(1);
  const dispatch =useDispatch();
  


  const { data: prod, error, isLoading } = useGetsingleProductQuery(id);
  
const cartitem =useSelector((state) =>state.cart)
console.log(cartitem)

  const addToCartHandler =() =>{
   dispatch(addToCart({...prod,qty}))
   
    


   




  }
  console.log(qty)


  return (
    <>
      <Link className="btn btn-light my-3" to={"/"}>
        Go Back
      </Link>
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.message}</Message>
      ) : (
        <>
          {prod && (
            <Row>
              <Col md={5}>
                <Image src={prod.image} alt={prod.name} fluid />
              </Col>
              <Col md={4}>
                <ListGroup>
                  <ListGroup.Item>
                    <h3>{prod.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating
                      value={prod.rating}
                      text={`${prod.numReviews} reviews`}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>price:₹{prod.price}</ListGroup.Item>
                  <ListGroup.Item>Description::{prod.description}</ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>
                          <strong>price:₹{prod.price}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          <strong>
                            {prod.countInstock > 0 ? "In Stock" : "Out Of Stock"}
                          </strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      {prod.countInstock > 0 &&(<ListGroup.Item>
                        <Row>
                          <Col>QTY</Col>

                          <Col>
                          <Form.Control as='select' value={qty} onChange={(e)=>setqty(Number(e.target.value))}>
                            {[...Array(prod.countInstock).keys()].map((x)=>(
                              <option key={x+1} value={x+1}>
                                {x+1}
                                </option>
                            ))}

                          </Form.Control>
                          </Col>

                        </Row>
                      </ListGroup.Item>)}
                    </ListGroup.Item>


                    <ListGroup.Item>
                      <Button
                        className="btn-block"
                        type="button"
                        disabled={prod.countInstock < 1}
                      onClick={addToCartHandler} >
                        Add To Card
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )} 
    </>
  );
};

export default ProductScreen;
