import React,{useState} from 'react';
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

function App() {
  const [username,setUsername]=useState('')
  const [code,setCode]=useState('')
  const [msg,setMsg]=useState('')
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
  
       for(let i=0;i<dbdata.length;i++)
          {
             
              if(dbdata[i].username==username)
                  {
                      if (dbdata[i].otp==code)
                      {
                         setMsg('User Logged In')
                      }
                  }
              else{
                  setMsg('Wrong Code. Please Enter Correct Code')
              }
              }
             
     }}>Let's Go</button>
     <br></br>
     <br></br>
     {msg}
    </div>
  );
}

export default App;
