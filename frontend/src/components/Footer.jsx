import React from 'react'
import { Container,Row,Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Footer = () => {
    const currentyear =new Date().getFullYear()
  return (


<footer style={{ color: 'white' }} className='foot'>
  <Container>
    <Row>
      <Col className='text-center pu-3'>

        <div className='contact'>
          <div className='contact-icons'>
          <p>Contact Us : </p>

            <a className='acontact' href={`mailto:gauravchotu58@gmail.com`}>
              <i style={{color:'white'}} class="fa fa-envelope"></i>
            </a>
            <a className='acontact' href="tel:8109107318">
              <i style={{color:'white'}} class="fa fa-phone"></i>
            </a>
            
           <iframe className='mcontact' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.4492794801495!2d77.63883487411879!3d12.878806616907866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6b046c407bb3%3A0xa536d8c2a3358ee!2sMJ%20Amaze!5e0!3m2!1sen!2sin!4v1712309423968!5m2!1sen!2sin"
            style={{width:'150px', height:'42px' ,border:0}}
            allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>

          <div className='follow-icons'>
            <p>Follow Us: </p>
            <a href="https://github.com/gauravaps">
              <i class="fa fa-github" style={{fontSize:'30px', color:'white'}}></i>
            </a>
            <a href="https://linkedin.com/in/gaurav-patel-269966225">
              <i class="fa fa-linkedin" style={{fontSize:'30px', color:'white'}}></i>
            </a>
            <a href="#">
              <i class="fa fa-facebook-f" style={{fontSize:'30px', color:'white'}}></i>
            </a>
            <a href="">
              <i class="fa fa-twitter" style={{fontSize:'30px', color:'white'}}></i>
            </a>
          </div>

             
        </div>

        <p>shopify.Shop &copy;{currentyear}</p>
      </Col>
    </Row>
  </Container>
</footer>


  )
}

export default Footer;