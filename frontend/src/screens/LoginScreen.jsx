import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form ,Button ,Row ,Col } from 'react-bootstrap'
import { FormContainer } from '../components/FormContainer'
import { useEffect, useState } from 'react'
import {useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/UserApiSlice';
import { setCredential } from '../slices/authSlice';
import {toast} from 'react-toastify'
import Loader from '../components/Loader';




const LoginScreen = () => {
const [email ,seteamil] =useState('')
const [password ,setpassword] =useState('')

const dispatch =useDispatch();
const navigate =useNavigate()

const [login ,{isLoading}] =useLoginMutation();

const {userInfo} =useSelector((state)=> state.auth);


 const { search } = useLocation();
 const sp = new URLSearchParams(search);
 const redirect = sp.get('redirect') || '/';

 useEffect(() => {
   if (userInfo) {
     navigate(redirect);
   }
 }, [navigate, redirect, userInfo]);
 

const submithandler =async(e)=>{
    e.preventDefault();
    try {
        const res =await login({email , password}).unwrap();
        dispatch(setCredential({...res}))
        navigate(redirect)
        


    } catch (err) {
        toast.error(err?.data?.message || err.error.message)
    }
}


  return (
    <FormContainer>
       <h1>Sign In</h1>
        <Form onSubmit={submithandler}>

            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type='email' placeholder='Enter your email'
                 value={email} 
                 onChange={(e) =>seteamil(e.target.value)}></Form.Control>

            </Form.Group>

            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' placeholder='Enter your Password'
                 value={password} 
                 onChange={(e) =>setpassword(e.target.value)}></Form.Control>

            </Form.Group>
            <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>Sign In</Button>
            {isLoading && <Loader/>}

        </Form>

        <Row className='py-3'>
            <Col>

            New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>  

          </Col>
        </Row>

    </FormContainer>
  )
}

export default LoginScreen