import React, { useEffect, useState } from 'react'
import { Form ,Button ,Col,} from 'react-bootstrap'
import { FormContainer } from '../components/FormContainer'
import CheckOutSteps from '../components/CheckOutSteps'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from '../slices/CartSlice'

const PaymentScreen = () => {
    
    const [paymentMethod ,setpaymentMethod] = useState('paypal')
    const dispatch =useDispatch()
    const cart = useSelector((state) =>state.cart)
    const {shippingAdress} =cart
    const navigate =useNavigate()


useEffect(()=>{
    if(!shippingAdress.address){
        navigate('/shipping')

    }
}, [shippingAdress.address , navigate])

const paymentHandel =(e)=>{
    e.preventDefault();

    dispatch(savePaymentMethod(paymentMethod))
    navigate('/orderplace')
    
     
}

  return (
    <FormContainer>
        <CheckOutSteps step1 step2 step3/>
        <h1>Payment Method</h1>
        <Form onSubmit={paymentHandel}>
            <Form.Group>
                <Form.Label as='legend'>Select Method</Form.Label>
                <Col>
                <Form.Check className='my-2' label='Paypal or Credit Card' id='paypal'
                name='paymentMethod'
                value='paypal'
                checked
                onChange={(e)=> setpaymentMethod(e.target.value)}
                
                ></Form.Check>
                </Col>
            </Form.Group>
            <Button type='submit' variant='primary'>Continue</Button>
        </Form>


    </FormContainer>
  )
}

export default PaymentScreen