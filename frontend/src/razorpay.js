import React, { useEffect, useState } from 'react';
import { useGetOrderByIdQuery, usePayOrderMutation, useGetRazorpayClientIdQuery } from '../slices/OrderApiSlice'; // Assuming you have Razorpay API slice imported
import { Button, Row, Col, Card, ListGroup, Image } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  console.log(orderId);

  const { data: order, refetch, isLoading, error } = useGetOrderByIdQuery(orderId);

  const { userInfo } = useSelector((state) => state.auth);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const { data: razorpayClient,
    isLoading: loadingRazorpay,
    error: errorRazorpay } = useGetRazorpayClientIdQuery(); // Assuming you have a Razorpay client ID API endpoint

  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!errorRazorpay && !loadingRazorpay && razorpayClient.clientId) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log("Razorpay script loaded successfully");
        // Yahan par Razorpay ka script load ho chuka hai, aap ab iska istemal kar sakte hain
      };
      document.body.appendChild(script);
    }
  }, [errorRazorpay, loadingRazorpay, razorpayClient]);

  // Razorpay payment logic
  async function onApproveTest() {
    const options = {
      key: razorpayClient.clientId, // Your Razorpay client ID
      amount: order.totalPrice * 100, // Amount in paisa
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Purchase Description',
      image: '/your_logo.png', // Your company logo
      order_id: 'your_order_id', // You need to generate order ID from backend
      handler: async (response) => {
        try {
          const data = {
            razorpay_payment_id: response.razorpay_payment_id,
            email: response.email, // Assuming you get email from response
          };
          await payOrder({ orderId, details: data });
          setIsPaymentSuccess(true);
          refetch();
          toast.success('Order is paid');

          // Payment verification after successful payment
          const paymentVerificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          const response = await fetch('/api/order/paymentverification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentVerificationData),
          });
          const verificationResult = await response.json();
          if (verificationResult.success) {
            // Payment verification successful
            console.log('Payment verification successful');
          } else {
            // Payment verification failed
            console.error('Payment verification failed:', verificationResult.message);
          }
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      },
      prefill: {
        email: userInfo.email, // Assuming you have user's email in userInfo
      },
      theme: {
        color: '#3399cc', // Theme color
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return isLoading ? <Loader /> : error ? <Message variant='danger' /> : (
    <>
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
              {order.isDelivered ? (<Message variant='success' />) : (<Message variant='danger'>Not Delivered</Message>)}

            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Payment Method:</h3>
              <p>
                <strong>Method:</strong>{order.paymentMethod}
              </p>
              {order.isPaid ? (<Message variant='success'>Paid on {order.paidAt}</Message>) :
                (<Message variant='danger'>Not Paid</Message>)}

            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/products/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col>
                      {item.qty} *{item.price} = ${item.qty * item.price}
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
                  <Col>₹{order.itemsPrice}</Col>
                </Row>

                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{order.shippingPrice}</Col>
                </Row>

                <Row>
                  <Col>Tax</Col>
                  <Col>₹{order.taxPrice}</Col>
                </Row>

                <Row>
                  <Col>Total</Col>
                  <Col>₹{order.totalPrice}</Col>
                </Row>

                {!order.isPaid && !isPaymentSuccess && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {(
                      <Button onClick={onApproveTest} style={{ marginBottom: '10px' }}>Pay with Razorpay</Button>
                    )}
                  </ListGroup.Item>
                )}

                {isPaymentSuccess && (
                  <ListGroup.Item>
                    <Message variant='success'>Payment Successful!</Message>
                  </ListGroup.Item>
                )}

                {/* MARK AS DELIVERED PLACEHOLDER */}
              </ListGroup.Item>

            </ListGroup>
          </Card>
        </Col>
      </Row>

    </>
  )


}

//export default OrderScreen;
