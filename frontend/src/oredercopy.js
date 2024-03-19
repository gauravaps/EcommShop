import React, { useEffect } from 'react'
import { useGetOrderByIdQuery ,usePayOrderMutation ,useGetPaypalClientIdQuery} from '../slices/OrderApiSlice'
import {Button ,Row ,Col ,Card, ListGroup, Image} from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'


const OrderScreen = () => {
  const { id: orderId } = useParams();
  console.log(orderId);
  
    const {data:order, refetch, isLoading ,error} =useGetOrderByIdQuery(orderId)

  const {userInfo} =useSelector((state)=> state.auth);
  const [payOrder,{isLoading:loadingpay}] =usePayOrderMutation();

  const {data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,} =useGetPaypalClientIdQuery()

    if(errorPayPal){
      console.log(errorPayPal)
    }else{
      console.log(paypal?.clientId) 
    }

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);



  //onApprove
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        console.log(orderId)
        refetch();
        toast.success('Order is paid');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }


  //paypal work here.
  async function onApproveTest() {
      await payOrder({ orderId:orderId, details: { payer: {} } });
       refetch();
  
      toast.success('Order is paid');
    }



  //onerror
  function onError (err){
    toast.error(err.message)
  
    
  }


//createorder
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice ,         
            
          },

          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
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

          {!order.isPaid && (
            <ListGroup.Item>
              {loadingpay && <Loader/>}
              { isPending ?<Loader/>:(
              <div>

                 <Button onClick={onApproveTest} style={{marginBottom:'10px'}}>test pay order</Button> 
                

                <div>

                 <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    ></PayPalButtons>


                  </div>

              </div>
              )}
            </ListGroup.Item>

          )}

          {/*MARK AS DELIVERED PLACEHOLDER */}
          

          </ListGroup.Item>

        </ListGroup>
      </Card>
    </Col>
  </Row>
  
  </>)
    
  
}

//export default OrderScreen;