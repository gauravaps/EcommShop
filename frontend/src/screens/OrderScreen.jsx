import React, { useEffect, useState } from 'react'
import { useGetOrderByIdQuery ,usePayOrderMutation ,useGetPaypalClientIdQuery ,useDeliveredOrderMutation} from '../slices/OrderApiSlice'
import {Button ,Row ,Col ,Card, ListGroup, Image} from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import axios from 'axios'


const OrderScreen = () => {
  const { id: orderId } = useParams();
  console.log(orderId);

  const { data: order, refetch, isLoading, error } = useGetOrderByIdQuery(orderId);
  const [deliveredOrder,{isLoading:loadingDelivered}] =useDeliveredOrderMutation()

  const { userInfo } = useSelector((state) => state.auth);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const { data: razorpayClient,
    isLoading: loadingRazorpay,
    error: errorRazorpay } = useGetPaypalClientIdQuery(); // Assuming you have a Razorpay client ID API endpoint

  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [razorpayOrderId, setRazorpayOrderId] = useState('');


  //get Razorpay oerder id Url
  useEffect(() => {
    if (order) {
      const res = axios.post('/api/order/createorder', {
        totalPrice: order.totalPrice,
        saveOrder: order,
      });
  
      res.then(response => {
        // Handle the response here
        try {
          const { order, razorpayOrder } = response.data;
          console.log('Received order:', order);
          console.log('Received Razorpay order:', razorpayOrder);
          console.log('Received Razorpay order ID:', razorpayOrder.id);
          setRazorpayOrderId(razorpayOrder.id);
        } catch (error) {
          console.error('Error:', error);
        }
      })
      .catch(error => {
        // Handle any errors here
        console.error('Error:', error);
      });
    }
  }, [order]);
  

//for razorpay script code
  useEffect(() => {
    if (!errorRazorpay && !loadingRazorpay && razorpayClient.clientId) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log("Razorpay script loaded successfully");
        console.log(razorpayClient.clientId)
        console.log(errorRazorpay)
        
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
      name: 'Shopify',
      description: 'Purchase Description',
      image: '/your_logo.png', // Your company logo
      order_id:razorpayOrderId, // You need to generate order ID from backend
      handler: async (paymentResponse) => { // 'paymentResponse' instead of 'response'

        try {
          const data = {
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            email: paymentResponse.email, // Assuming you get email from response
          };
          
          await payOrder({ orderId, details: data });
          setIsPaymentSuccess(true);
          refetch();
          toast.success('Order is paid');
  
          const paymentVerificationData = {
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
          };

        //if transaction success save all tranction ID save into databse..
      const transactionResponse = await axios.post('/api/order/createtransaction', paymentVerificationData);

      if (transactionResponse.data.success) {
        console.log('Razorpay transaction created successfully:', transactionResponse.data.transaction);
      } else {
        console.error('Error creating Razorpay transaction:', transactionResponse.data.message);
      }
     

          //console all
          console.log('Razorpay Order ID:', paymentResponse.razorpay_order_id);
        console.log('Razorpay Payment ID:', paymentResponse.razorpay_payment_id);
        console.log('Razorpay Signature:', paymentResponse.razorpay_signature);



          const response = await fetch('/api/order/verify', {
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
          console.log(err)
        }



      },
      prefill: {
        email:userInfo.email, // Assuming you have user's email in userInfo
      },
      theme: {
        color: '#3399cc', // Theme color
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  //deliverd handler
  const deliverdOrderHandel = async(e)=>{
    e.preventDefault()
try {
      const res =await deliveredOrder(orderId)
      refetch();
      toast.success('Order delivered');
  
} catch (err) {
  toast.error(err?.data?.message || err.message)
  
}
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
              {order.isDelivered ? (<Message variant='success' >Delivered on {order.deliveredAt}</Message>) : 
              (<Message variant='danger'>Not Delivered</Message>)}

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
                      <Button onClick={onApproveTest} style={{ marginBottom: '10px' }}>Pay Now</Button>
                    )}
                  </ListGroup.Item>
                )}

                {isPaymentSuccess && (
                  <ListGroup.Item>
                    <Message variant='success'>Payment Successful!</Message>
                  </ListGroup.Item>
                )}

                {loadingDelivered &&<Loader/>}
                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered &&(
                  <ListGroup.Item>
                    <Button type='button' className='btn btn-block' onClick={deliverdOrderHandel}>Mark As Delivered </Button>
                  </ListGroup.Item>
                )}
              </ListGroup.Item>

            </ListGroup>
          </Card>
        </Col>
      </Row>

    </>
  )


}

export default OrderScreen;
