import React, { useEffect } from 'react'
import { Button ,Row ,Col,ListGroup, Image ,Card } from 'react-bootstrap'
import CheckOutSteps from '../components/CheckOutSteps'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useCreateOrderMutation } from '../slices/OrderApiSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { clearCartItem } from '../slices/CartSlice'


const PlaceOrderScreen = () => {
    const cart = useSelector((state) =>state.cart)
    const {userInfo} =useSelector((state)=> state.auth);
    const dispatch =useDispatch()
    
    const {shippingAdress} =cart
    const navigate =useNavigate()

    const [createOrder,{isLoading ,error}] =useCreateOrderMutation()


    useEffect(()=>{
        if(!shippingAdress){
            navigate('/shipping')
        }else if(!cart.paymentMethod){
            navigate('/payment')
        }

    }, [shippingAdress, cart.paymentMethod ,navigate])

//place order function
    const placeorder = async()=>{
    

        try {
            const res = await createOrder({
                
                orderItems:cart.cartItem,
                shippingAddress:cart.shippingAdress,
                paymentMethod:cart.paymentMethod,
                itemsPrice:cart.itemsPrice,
                taxPrice:cart.taxPrice ,  
                shippingPrice:cart.shippingPrice,          
                totalPrice:cart.totalPrice,
            }).unwrap();
            console.log(res)

            dispatch(clearCartItem());
            navigate(`/order/${res._id}`)

        } catch (error) {
            toast.error(error.message);
            
        }
    }


  return (
    <>
    <CheckOutSteps step1 step2 step3 step4 />
    <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Shipping Address</h2>
                    <p>
                        <strong>Address:</strong>
                        {shippingAdress.address},{shippingAdress.city},{shippingAdress.postalCode},
                        {shippingAdress.county}
                    </p>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <strong>Method:</strong>
                    {cart.paymentMethod}
                </ListGroup.Item>

                <ListGroup.Item>
                    <h2>Order Items</h2>
                    
                    {cart.cartItem.length ===0 ? (<Message>Your cart is empty</Message>):
                    (<ListGroup variant='flush'>
                    {cart.cartItem.map((item ,index) =>(
                        <ListGroup.Item key={index}>
                            <Row>
                                <Col md={1}>
                                    <Image src={item.image} alt={item.name} fluid rounded/>
                                </Col>

                                <Col>
                                <Link to={`/product/${item._id}`}>{item.name}</Link>
                                </Col>

                                <Col md={4}>
                                    {item.qty}*{item.price} ={item.qty*item.price}
                                </Col>


                            </Row>
                        </ListGroup.Item>
                    ))}
                    </ListGroup>)}
                </ListGroup.Item>


            </ListGroup>
        </Col>

        <Col md={4}> 
        <Card>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h1>Order Summary</h1>
                </ListGroup.Item>

                <ListGroup.Item>
                    <Row>
                        <Col>Items:</Col>
                        <Col>${cart.itemsPrice}</Col>
                    </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                    <Row>
                        <Col>Shipping:</Col>
                        <Col>${cart.shippingPrice}</Col>
                    </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                    <Row>
                        <Col>tax:</Col>
                        <Col>${cart.taxPrice}</Col>
                    </Row>
                </ListGroup.Item>

                
                <ListGroup.Item>
                    <Row>
                        <Col>Total :</Col>
                        <Col>${cart.totalPrice}</Col>
                    </Row>
                </ListGroup.Item>

                      <ListGroup.Item>

                        {error && <Message variant="danger">
                        {error?.data?.message || error.message} 
                         </Message>}

                        {console.log(error)}
                        </ListGroup.Item>

                
                <ListGroup.Item>

                    <Button type='button' className='btn-block' 
                    disabled={cart.cartItem.length ===0} onClick={placeorder}>
                        Place Order
                    </Button>
                    {isLoading && <Loader/>}
                </ListGroup.Item>

            </ListGroup>
        </Card>
        </Col>
    </Row>
    
    </>
  )
}

export default PlaceOrderScreen