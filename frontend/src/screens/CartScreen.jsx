import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux';
import { Row,Col ,ListGroup ,Image ,Form,Button ,Card } from 'react-bootstrap'
import {FaTrash} from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeCart} from '../slices/CartSlice';


const CartScreen = () => {

    const navigate =useNavigate();
    const dispatch =useDispatch()
    

    const cart =useSelector((state)=> state.cart);
    const {cartItem} =cart;

    const addToqtyhandler =(product,qty)=>{
        dispatch(addToCart({...product,qty}))   

    }

    const removeItem =(id) =>{

      dispatch(removeCart(id))

    }

    //process to checkout
    const proceedToCheckOut =() =>{
      navigate('/login?redirect=/shipping');
    }

      return (

    <div>
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>
        {cartItem.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItem.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={`/uploads/${item.image}`} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) =>
                        addToqtyhandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInstock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={()=> removeItem(item._id)}
                      
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItem.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              $
              {cartItem
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={cartItem.length === 0}
                onClick={proceedToCheckOut}
                
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
    </div>
  )
}

export default CartScreen