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
const userCollection = collection(db, "user");

function Auth_Referral() {

  const navigate = useNavigate();
  const [username,setUsername]=useState('')
  const [code,setCode]=useState('')
  const [msg,setMsg]=useState('')
  const { referralCode } = useParams();
  const [coins,setCoins]=useState(0)
  const [highScore,setHighScore]=useState(0)
 

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
    referralFunction()
  }, [referralCode]);





  return (
    <div className="App">
      <br></br><br></br><br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
     <input placeholder='Enter Telegram Username' onChange={(e)=>{
      setUsername(e.target.value)
     }}></input>
     <br></br>
     <br></br>
     <input placeholder='Enter the Code sent on the Bot' onChange={(e)=>{
      setCode(e.target.value)
     }}></input>
       <br></br>
       <br></br>
     <button onClick={async()=>{
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
                         setMsg('User Logged In')
                         if(referralCode)
                            {
                                window.location.reload();
                            }
                            else
                            {
                                navigate('/Home')
                            }
                        
                         flag=1;
                         break;
                      }
                  }
            
              }
        if(flag==0)
          {
            setMsg("Incorrect Username or Code")
          }
             
     }}>Let's Go</button>
     <br></br>
     <br></br>
    
   {msg}
     <br></br>
     <br></br>
     
    </div>
  );
}

export default Auth_Referral;
