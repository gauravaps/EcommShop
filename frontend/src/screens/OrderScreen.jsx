import React from 'react'
import { useGetOrderByIdQuery } from '../slices/OrderApiSlice'
import {Button ,Row ,Col ,Card, ListGroup, Image} from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'

const OrderScreen = () => {
    const {id:userId} =useParams()
    console.log(userId)
    const {data:order, isFetching, isLoading ,error} =useGetOrderByIdQuery(userId)


    if(error){
        console.log(error) 
    }else{
        console.log(order);

    }

  return  isLoading ? <Loader/>:error? <Message variant='danger'/> :
  (<>
  <h4>Order {order._id}</h4>
  <Row>
    <Col md={8}>
    <ListGroup>
      <ListGroup.Item>
        <h4>Shipping</h4>
        <p>
          <strong>Name:</strong>{order.user.name}
        </p>
        <p>
          <strong>Email:</strong>{order.user.email}
          </p>

          <p>
            <strong>Address:</strong>
            {order.shippingAddress.address}

            {order.shippingAddress.city}-

            {order.shippingAddress.postalCode}-

            {order.shippingAddress.country}
          </p>
          {order.isDelivered ? (<Message variant='success'/>):(<Message variant='danger'>Not Delivered</Message>)}

      </ListGroup.Item>

      <ListGroup.Item>
        <h3>Payment Method:</h3>
        <p>
          <strong>Method:</strong>{order.paymentMethod}
        </p>
        {order.isPaid ? (<Message variant='success'>Paid on {order.paidAt}</Message>):
        (<Message variant='danger'>Not Paid</Message>)}

      </ListGroup.Item>

      <ListGroup.Item>
        <h2>Order items</h2>
        {order.orderItems.map((item ,index) =>(
          <ListGroup.Item key={index}>
            <Row>
              <Col md={1}>
              <Image src={item.image} alt={item.name} fluid rounded/>
              </Col>
              <Col>
              <Link to={`/products/${item._id}`}>{item.name}</Link>
              </Col>
              <Col>
              {item.qty} *{item.price} = ${item.qty*item.price}
              </Col>
            </Row>

          </ListGroup.Item>
        ))}
      </ListGroup.Item>
    </ListGroup>

    </Col>


    <Col md={4}>
      <Card>
        <ListGroup variant='flush'>
          <ListGroup.Item>
            <h2>Order Summary</h2>

          </ListGroup.Item>

          <ListGroup.Item>
          <Row>
            <Col> Items</Col>
            <Col>${order.itemsPrice}</Col>
          </Row>

          <Row>
            <Col>Shipping</Col>
            <Col>${order.shippingPrice}</Col>
          </Row>

          <Row>
            <Col>Tax</Col>
            <Col>${order.taxPrice}</Col>
          </Row>

          <Row>
            <Col>Total</Col>
            <Col>${order.totalPrice}</Col>
          </Row>
          {/*pay order placeholde */}
          {/*MARK AS DELIVERED PLACEHOLDER */}
          

          </ListGroup.Item>

        </ListGroup>
      </Card>
    </Col>
  </Row>
  
  </>)
    
  
}

export default OrderScreen;