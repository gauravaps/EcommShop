import React, { useEffect, useState } from 'react'
import { setCredential } from '../slices/authSlice';
import { Form ,Table ,Button ,Row ,Col} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileUpdateMutation } from '../slices/UserApiSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useGetmyOrdersQuery } from '../slices/OrderApiSlice';
import Message from '../components/Message';
import { FaTimes } from 'react-icons/fa';


const ProfleUpdateScreen = () => {

    const { userInfo } = useSelector((state) => state.auth);

    const [name ,setname] =useState('')
    const [email ,setemail] =useState('')
    const [password ,setpassword] =useState('')
    const [confirmPassword , setconfirmPassword] =useState('')

    const dispatch =useDispatch()
    const [profileUpdate,{isLoading:loadingprofileupdate}] =useProfileUpdateMutation()

    const {data:order ,isLoading ,error} =useGetmyOrdersQuery()


    useEffect(()=>{
        if(userInfo){
            setname(userInfo.name)
            setemail(userInfo.email)
        }

    },[userInfo ,userInfo.name ,userInfo.email])



    const submitHandler =async(e) =>{
        e.preventDefault();

        if(password !== confirmPassword){
            toast.error('Password do not match')
        }else{
            try {
                const res =await profileUpdate({ _id:userInfo._id ,name,email ,password}).unwrap();

                toast.success('User profile updated')
                dispatch(setCredential(res))
                
            } catch (err) {
                toast.error(err?.data?.message || err?.error);
                
            }
        }

        
    }



  return <Row>
    <Col md={3}>
    <h2>User Profile</h2>
    <Form onSubmit={submitHandler}>

        <Form.Group controlId='name' className='my-2'>
            <Form.Label>Name</Form.Label>
            <Form.Control type='name' placeholder='Enter your name' 
            value={name} onChange={(e) =>setname(e.target.value)}
            ></Form.Control>
        </Form.Group>

        
        <Form.Group controlId='email' className='my-2'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control type='email' placeholder='Enter your email' 
            value={email} onChange={(e) =>setemail(e.target.value)}
            ></Form.Control>
        </Form.Group>

        
        <Form.Group controlId='password' className='my-2'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='Enter your password' 
            value={password} onChange={(e) =>setpassword(e.target.value)}
            ></Form.Control>
        </Form.Group>

        
        <Form.Group controlId='confirm password' className='my-2'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type='password' placeholder='Enter your confirm password' 
            value={confirmPassword} onChange={(e) =>setconfirmPassword(e.target.value)}
            ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-2'>Update</Button>
        {loadingprofileupdate && <Loader/>}

    </Form>
    </Col>


    <Col md={9}>
        <h2>My Orders</h2>
        {isLoading?(<Loader/>) :error? (<Message variant='danger'> {error?.data?.message || error.error}</Message>):
        (<Table striped  hover responsive className='table-sm'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th> </th>
                </tr>
            </thead>
            <tbody>
                {order.map((orderItem) =>(
                    <tr key={orderItem._id}>
                        <td>{orderItem._id}</td>
                        <td>{orderItem.createdAt.substring(0,10)}</td>
                        <td>{orderItem.totalPrice}</td>
                        <td>{orderItem.isPaid?(orderItem.paidAt.substring(0,10)):(
                            <FaTimes style={{color:'red'}}/>
                        )}</td>
                        
                        <td>{orderItem.isDelivered?(orderItem.deliveredAt.substring(0,10)):(
                            <FaTimes style={{color:'red'}}/>
                        )}</td>
                        
                        <td>
                            <LinkContainer to={`/order/${orderItem._id}`}>
                                <Button className='btn-sm' variant='light'>Details</Button>
                            </LinkContainer>
                        </td>
                        
                    </tr>
                ))}
            </tbody>


        </Table>)}
    </Col>

  </Row>
  
}

export default ProfleUpdateScreen;