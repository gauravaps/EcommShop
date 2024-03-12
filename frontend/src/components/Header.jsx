import React from 'react'
import {FaShoppingCart, FaUser} from 'react-icons/fa'
import {Navbar ,Nav,Container, Badge} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import logo2 from '../assests/shopify white (1).png'
import { Link } from 'react-router-dom'
import {  useSelector } from 'react-redux'





const Header = () => {
  const {cartItem} = useSelector((state)=>state.cart)
  console.log(cartItem)






  return (
    <header > 
    <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container >

          <LinkContainer to={'/'}> 
             <Navbar.Brand className='navbr'> <img className='navimg' src={logo2} alt="no found" /> shopify.Shop</Navbar.Brand> 
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
                 
                <LinkContainer to={'/login'}> 
                 <Nav.Link><FaUser/>Login</Nav.Link>  
                
                </LinkContainer>
 
            </Nav>



        </Navbar.Collapse>
        </Container>
    </Navbar>

    </header>
  )
}

export default Header