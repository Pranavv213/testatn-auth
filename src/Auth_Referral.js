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
      <br></br><br></br><br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>

      <button className="open-modal">Open Modal</button>

<div className="modal">
  <div className="view">
    <h2>Register</h2>
    <center>
      <span style={{ color: 'red' }}>&#9888;</span>
      <i style={{ color: 'grey' }}>
        Give your original username <br /> otherwise you may lose the airdrop
      </i>
    </center>
    <br />
    <br />
    <input type="text" placeholder="Telegram username" onChange={(e)=>{
      setUsername(e.target.value)
     }}/>
    <input type="password" placeholder="Code sent on BeraBuck Bot" onChange={(e)=>{
      setCode(e.target.value)
     }}/>

    <input type="text" placeholder="Referral Code ( Optional )" onChange={(e)=>{
      setReferralC(e.target.value)
     }}/>
     <center>
     
      <i style={{ color: 'grey' }}>
       If you don't have a Refferal Code, <br /> leave it empty
      </i>
    </center>
    <br />
    <br />

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
                        //  alert(dbdata[i].referralCode)
                         if(referralC)
                            {
                                for(let j=0;j<dbdata.length;j++)
                                  {
                                    console.log(dbdata[j].referralCode)
                                    if(dbdata[j].referralCode==referralC && dbdata[i].coins==0)
                                      {

                                        let userDoc = doc(db, "user", dbdata[j].id);
                                        let newFields = { username:dbdata[j].username,otp:dbdata[j].otp,friends:[...dbdata[j].friends,localStorage.getItem('userName')],coins:dbdata[j].coins+25000,highscore:0 };
                                        await updateDoc(userDoc, newFields);

                                        userDoc = doc(db, "user", dbdata[i].id);
                                        newFields = { username:dbdata[i].username,otp:dbdata[i].otp,friends:[...dbdata[i].friends,dbdata[j].username],coins:dbdata[i].coins+25000,highscore:0 };
                                        await updateDoc(userDoc, newFields);
                                        window.location.reload();
                                      }
                                  }

                                  setMsg('Incorrect Refferal Code')
                               
                            }
                            else if(referralC=="")
                              {
                                window.location.reload();
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
     {msg}
  </div>
</div>
     
     
     <br></br>
     <br></br>
     <br></br>
    
   {msg}
     <br></br>
     <br></br>
     
    </div>
  );
}

export default Auth_Referral;
