import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form ,Button ,Row ,Col } from 'react-bootstrap'
import { FormContainer } from '../components/FormContainer'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useRegistrationMutation} from '../slices/UserApiSlice';
import { setCredential } from '../slices/authSlice';
import {toast} from 'react-toastify'
import Loader from '../components/Loader';



 
const Registration = () => {

const [name ,setname] =useState('')    
const [email ,setemail] =useState('')
const [password ,setpassword] =useState('')
const [confirmPassword ,setconfirmPassword] =useState('')

const dispatch =useDispatch();
const navigate =useNavigate()

const [register ,{isLoading}] =useRegistrationMutation();

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

    if(password !==confirmPassword){
        toast.error('Password do not match')
    }else{

        try {

            // Simple email validation using regex
            const isValidEmail = (email) => {
            return /^[a-zA-Z]+[a-zA-Z0-9._%+-]*@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/.test(email);
      };

            if (!isValidEmail(email)) {
            console.log(email);
                //throw new Error('Please enter a valid email address'); 
                toast.error("Please enter a valid email address");
                return;
      }


            const res =await register({name, email , password }).unwrap();
            console.log(res)
            dispatch(setCredential({...res}))
            if(userInfo){
                navigate('/')
            }
               
        } catch (err) {
            toast.error(err?.data?.message || err.error.message)
       }
    }

    }



  return (
    <FormContainer>
        <h1>Sign Up</h1>
        <Form onSubmit={submithandler}>

        <Form.Group controlId='name' className='my-3'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='text' placeholder='Enter your name'
                 value={name} 
                 onChange={(e) =>setname(e.target.value)}></Form.Control>

            </Form.Group>

            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type='email' placeholder='Enter your email'
                 value={email} 
                 onChange={(e) =>setemail(e.target.value)}></Form.Control>

            </Form.Group>

            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' placeholder='Enter your Password'
                 value={password} 
                 onChange={(e) =>setpassword(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='confirmPassword' className='my-3'>
                <Form.Label> Confirm Password</Form.Label>
                <Form.Control type='password' placeholder='Enter your confirm Password'
                 value={confirmPassword} 
                 onChange={(e) =>setconfirmPassword(e.target.value)}></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>Register</Button>
            {isLoading && <Loader/>}

        </Form>

        <Row className='py-3'>
            <Col>

            Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link> 

           </Col>
        </Row>

    </FormContainer>
  )
}

export default Registration;