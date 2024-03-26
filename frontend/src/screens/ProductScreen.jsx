import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Image, Col, ListGroup, Row, Button, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import { useGetsingleProductQuery ,useCreateReviewMutation} from "../slices/ProductApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductScreen = () => {
  const { id:productId } = useParams();
  const [qty ,setqty] = useState(1);
  const [rating ,setrating] =useState(0);
  const [comment ,setcomment] =useState('');

  const dispatch =useDispatch();
  


  const { data: prod, error,refetch, isLoading } = useGetsingleProductQuery(productId);
  const [createReview ,{isLoading:loadingreview}] =useCreateReviewMutation()
  
const cartitem =useSelector((state) =>state.cart)
const {userInfo} =useSelector((state)=> state.auth);

console.log(cartitem)

  const addToCartHandler =() =>{
   dispatch(addToCart({...prod,qty}))
  


  }
  console.log(qty)

  //handler reviews
  const handelReview = async (e) => {
    e.preventDefault();
    const reviewdata = { _id: productId, rating: rating, comment: comment };
  
    try {
      const res = await createReview(reviewdata);
      console.log(res);
      refetch();
      setrating(0);
      setcomment('');
      if (res.error) {
        toast.error(res.error?.data?.message || 'An error occurred');
      } else {
        toast.success('Review submitted');
      }
    } catch (err) {
      toast.error(err?.data?.message || 'An error occurred');
    }
  };
  
  
  
  
  
    


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

        <>
            <Row>
              <Col md={5}>
                <Image src={`/uploads/${prod.image}`} alt={prod.name} fluid />
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
            
            <Row className="review">
              <Col md={6}>
                <h2>Reviews</h2>
                {prod.reviews.length ===0 && <Message>No Reviews</Message>}
                <ListGroup variant="flush">
                  {prod.reviews.map((review) =>(
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating}/>
                      <p>{review.createdAt.substring(0,10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}

                  <ListGroup.Item>
                    <h2>Write a Customer Review</h2>
                    {loadingreview && <Loader/>}
                    {userInfo ?(<Form onSubmit={handelReview}>
                      <Form.Group controlId="rating" className="my-2">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control as='select' value={rating} onChange={(e) =>setrating(Number(e.target.value))}>

                          <option value=''> Seleect...</option>
                          <option value="1">1-Poor</option>
                          <option value="2">2-Fair</option>
                          <option value="3">3-Good</option>
                          <option value="4">4-Very Good</option>
                          <option value="5">5-Excelent</option>

                        </Form.Control>

                      </Form.Group>
                      <Form.Group controlId="comment" className="my-2">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control as='textarea' rows='3' value={comment} 
                        onChange={(e)=>setcomment(e.target.value)}>

                        </Form.Control>
                      </Form.Group>
                      <Button disabled={loadingreview} type='submit' variant='primary'>Submit</Button>
                    </Form>) : (<Message>Please <Link to={'/login'}>Sign in</Link> to write a review</Message>)}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
            
            
            </>
          
            
          )}
        </>
      )} 
    </>
  );
};

export default ProductScreen;
