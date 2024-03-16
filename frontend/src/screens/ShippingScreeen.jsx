
import React, { useState } from 'react'
import { saveShippingAddress } from '../slices/CartSlice';
import { Button,Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FormContainer } from '../components/FormContainer';
import { useNavigate } from 'react-router-dom';
import CheckOutSteps from '../components/CheckOutSteps';

const ShippingScreeen = () => {
    
    const cart =useSelector((state) =>state.cart)
    const {shippingAdress}=cart ;

    //useState here
    const [address ,setaddress] =useState(shippingAdress?.address || '')
    const [city ,setcity] =useState(shippingAdress?.city || '')
    const [postalCode , setpostalCode] =useState(shippingAdress?.postalCode || '')
    const [country ,setcountry] =useState(shippingAdress?.country || '')

    const dispatch =useDispatch() 
    const navigate =useNavigate()

    //handler function 
    const submitHandler =(e) =>{
        e.preventDefault();
        dispatch(saveShippingAddress({address ,city ,postalCode ,country}))
        navigate('/payment')
    }

  return (
    <FormContainer>
        <CheckOutSteps step1 step2  />
    
        <h1>Shipping</h1>
        <Form onSubmit={submitHandler}>

            <Form.Group controlId='address' className='my-2'>

                <Form.Label>Address</Form.Label>
                <Form.Control type='text' placeholder='Enter your address' value={address}
                 onChange={(e) =>setaddress(e.target.value)}>
                </Form.Control>

            </Form.Group>

            <Form.Group controlId='City' className='my-2'>
                
                <Form.Label>City</Form.Label>
                <Form.Control type='text' placeholder='Enter your city' value={city}
                 onChange={(e) =>setcity(e.target.value)}>
                </Form.Control>

            </Form.Group>

            <Form.Group controlId='postalCode' className='my-2'>
                
                <Form.Label>Postalcode</Form.Label>
                <Form.Control type='text' placeholder='Enter your postal code' value={postalCode}
                 onChange={(e) =>setpostalCode(e.target.value)}>
                </Form.Control>

            </Form.Group>

            <Form.Group controlId='country' className='my-2'>
                
                <Form.Label>Country</Form.Label>
                <Form.Control type='text' placeholder='Enter your county' value={country}
                 onChange={(e) =>setcountry(e.target.value)}>
                </Form.Control>

            </Form.Group>

            <Button type='submit' variant='primary' className='my-2'>Continue</Button>

        </Form>
    </FormContainer>
  )
}

export default ShippingScreeen;