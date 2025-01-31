import React from 'react'
import { Scanner } from '@yudiel/react-qr-scanner';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from './assets/logo.jpeg'
function Attend() {
  return (
    <div>
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="https://testatn-auth.vercel.app/"><img style={{width:'2em' }} src={logo}></img> {localStorage.getItem('userName')}</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="https://extended-adapts-994414.framer.app/">Events</Nav.Link>
            <Nav.Link href="https://extended-adapts-994414.framer.app/partner">Partner</Nav.Link>
            
          </Nav>
          <Nav>
            <Nav.Link href="#deets">Airdrop</Nav.Link>
           
          </Nav><Nav>
            <Nav.Link onClick={()=>{
               localStorage.clear();
               window.location.reload();

            }}>Refresh</Nav.Link>
           
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
   <br></br> <br></br> 

   <center>

    <p style={{color:'white',fontSize:'25px'}}> Place your QR Code to earn Rewards </p>
            <br></br>

   <div style={{width:'20em'}}>  <Scanner  onScan={(result) => console.log(result)} />;</div>
   </center>
    
    </div>
  )
}

export default Attend
