import React,{useEffect,useState} from 'react'
import coin from './assets/coin.png'
import logo from './assets/logo.jpeg'
import 'bootstrap/dist/css/bootstrap.min.css';

import "./Home.css"; // Import the CSS file

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import './Register.css'

const userCollection = collection(db, "user");



const Home = () => {

  const [coins,setCoins]=useState(localStorage.getItem('points'))

  

  const getPoints=async()=>{
    const data = await getDocs(userCollection);
         
           let dbdata= data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    
           let flag=0;
      
           for(let i=0;i<dbdata.length;i++)
              {
                 
                 
                  if(dbdata[i].username==localStorage.getItem('userName'))
                  {
                   
                    localStorage.setItem('points',dbdata[i].points)
                    setCoins(dbdata[i].points)
                    flag=1
                  }
                }
  }

  useEffect(()=>{getPoints()},[])
  return (
    <div className="home-container" >
       <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="https://testatn-auth.vercel.app/"><img style={{width:'2em' }} src={logo}></img> {localStorage.getItem('userName')}</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="https://connectverse.club/events2">Events</Nav.Link>
            <Nav.Link href="https://connectverse.club/partner2">Partner</Nav.Link>
            
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
   
     
      
      <div class="points">
      <img style={{width:'8em'}} src={coin}></img> :<p style={{fontSize:'55px',color:'white'}}><b>{coins}</b></p> 
      </div>
    </div>
  );
};

export default Home;
