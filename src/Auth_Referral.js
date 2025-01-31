import React,{useState,useEffect} from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
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
import 'bootstrap/dist/css/bootstrap.min.css';
import logo2 from './assets/logo2.png'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
const userCollection = collection(db, "user");


function Auth_Referral() {

  const navigate = useNavigate();
  const [username,setUsername]=useState('')
  const [code,setCode]=useState('')
  const [msg,setMsg]=useState('')
  const { referralCode } = useParams();
  const [coins,setCoins]=useState(0)
  const [highScore,setHighScore]=useState(0)
  const [referralC,setReferralC]=useState('')

  const referralFunction=async ()=>{
    
    if(!localStorage.getItem('userId'))
        {
            return;
        }
    
    if (referralCode) {
        
    const data = await getDocs(userCollection);
    let dbdata= data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

   let flag=-5;

   for(let i=0;i<dbdata.length;i++)
      {
         
          if(dbdata[i].username==referralCode)
              {
                 
                     flag=i;
                     break;
                  
              }
        
          }


    if(flag==-5)
        {
            alert('Invalid Referral Code')
        }
        else if(flag>=0 && dbdata[localStorage.getItem('userNum')].coins==0)
            {
                let userDoc = doc(db, "user", dbdata[flag].id);
                let newFields = { username:dbdata[flag].username,otp:dbdata[flag].otp,friends:[...dbdata[flag].friends,localStorage.getItem('userName')],coins:dbdata[flag].coins+25000,highscore:0 };
                await updateDoc(userDoc, newFields);
                userDoc = doc(db, "user", localStorage.getItem('userId'));
                newFields = { username:localStorage.getItem('userName'),otp:dbdata[localStorage.getItem('userNum')].otp,friends:[...dbdata[localStorage.getItem('userNum')].friends,dbdata[flag].username],coins:dbdata[localStorage.getItem('userNum')].coins+25000,highscore:0 };
                await updateDoc(userDoc, newFields);
                navigate('/Home');
                
            }
    
  

}}

  useEffect(() => {
    if(localStorage.getItem('userNum'))
      {
        navigate('/Home')
      }
  }, []);





  return (
    <div className="App">
      <br></br><br></br><br></br><br></br>
    
      


     

     <center>
<div style={{
  width:'80%',
  background: "rgba(255, 255, 255, 0.2)",
  borderRadius: "16px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)", // Use camelCase for vendor prefixes
  border: "1px solid rgba(255, 255, 255, 0.3)"
}}>
      
     <img style={{width:'10em'}} src={logo2}></img>
     <br></br><br></br>
      <input style={{ width:'17em', height:'2em',backgroundColor:'black',color:'white'}} type="text" placeholder="              Telegram username" onChange={(e)=>{
      setUsername(e.target.value)
     }}/>
     <br></br>  <br></br>
    <input style={{ width:'17em', height:'2em',backgroundColor:'black',color:'white'}} type="password" placeholder="              Code sent on Bot" onChange={(e)=>{
      setCode(e.target.value)
     }}/>
     

 <br></br> <br></br>
   

    <Button style={{ width:'17em'}} onClick={async()=>{
       const data = await getDocs(userCollection);
     
       let dbdata= data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

       let flag=0;
  
       for(let i=0;i<dbdata.length;i++)
          {
             
              if(dbdata[i].username==username)
                  {
                      if (dbdata[i].otp==code)
                      {
                        localStorage.setItem('userNum',i)
                        localStorage.setItem('userId',dbdata[i].id)
                        localStorage.setItem('userName',dbdata[i].username)
                        localStorage.setItem("points",dbdata[i].points)
                        localStorage.setItem("walletAddress",dbdata[i].walletAddress)
                        localStorage.setItem("friends",JSON.stringify(dbdata[i].events))
                        localStorage.setItem("otp",dbdata[i].otp)
                        localStorage.setItem("chatId",dbdata[i].chatId)
                        let arr=dbdata;
                        arr.sort((a, b) => b.highscore - a.highscore);
                        localStorage.setItem("rankArray",JSON.stringify(arr.slice(0,100)))

                         setMsg('User Logged In')
                        //  alert(dbdata[i].referralCode)
                        

                        window.location.reload();
                        
                         flag=1;
                         break;
                      }
                  }
            
              }
        if(flag==0)
          {
            setMsg("Incorrect Username or Code")
          }
             
     }}>Let's Go</Button>
      <br></br><br></br><br></br><br></br>
     </div>
</center>
     
     <br></br>
     {msg}
  </div>


  );
}

export default Auth_Referral;
