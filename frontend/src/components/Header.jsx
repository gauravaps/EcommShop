import React, { useState } from 'react'
import {FaShoppingCart, FaUser} from 'react-icons/fa'
import {Navbar ,Nav,Container, Badge, Form,Button, NavDropdown} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import logo2 from '../assests/shopify white (1).png'
import { Link, useNavigate } from 'react-router-dom'
import {  useDispatch, useSelector } from 'react-redux'
import { useLoginMutation, useLogoutuserMutation } from '../slices/UserApiSlice'
import { logout } from '../slices/authSlice'
import { toast } from 'react-toastify'






const Header = () => {



  const {cartItem} = useSelector((state)=>state.cart)
  const {userInfo} =useSelector((state)=> state.auth);
  const dispatch =useDispatch()
  const navigate =useNavigate()
  const [logoutApi] =useLogoutuserMutation()


  const logoutHandler = async()=>{
    try {
      await logoutApi()
      dispatch(logout(userInfo))
      navigate('/login')
      

    } catch (err) {
      console.log(err)
      toast.error(err?.data?.message || err.error.message)




      
    }
    
  }



 


  return (
    <header > 
    <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container >

          <LinkContainer to={'/'}> 
             <Navbar.Brand className='navbr'> <img className='navimg' src={logo2} alt="no found" /></Navbar.Brand> 
             </LinkContainer>
        
        <Navbar.Toggle aria-controls='basic-navbar-nav'/>
        <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>

              
              
              <LinkContainer to={'/cart'}> 
                <Nav.Link> 
                  <FaShoppingCart/>Cart
                  {cartItem.length > 0 && (
                    <Badge pill bg='success' style={{marginLeft:'5px'}}>
                        {cartItem.reduce((initial,curr) => initial + curr.qty,0 ) }
                    </Badge>
                  )}
                  </Nav.Link>
                </LinkContainer>
                 {userInfo ?(<NavDropdown title={userInfo.name} id='username'> 
                 <LinkContainer to={'/profile'}>
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                 </LinkContainer>
                 <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                 
                 </NavDropdown>):(<LinkContainer to={'/login'}> 
                 <Nav.Link><FaUser/>Login</Nav.Link>    
                </LinkContainer>
                )}
                {userInfo && userInfo.isAdmin &&(
                  <NavDropdown title='Admin' id='adminmenu'>
                    <LinkContainer to={'/admin/productlist'}>
                      <NavDropdown.Item>Product</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to={'/admin/userlist'}>
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to={'/admin/orderlist'}>
                      <NavDropdown.Item>Order</NavDropdown.Item>
                    </LinkContainer>



                  </NavDropdown>
                )}
                
            </Nav>



        </Navbar.Collapse>
        </Container>
    </Navbar>

    </header>
  )
}

export default Header