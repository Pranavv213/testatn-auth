import React, { useState,useEffect } from 'react'
import { useParams,useNavigate } from 'react-router-dom';
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


function Home() {

  const navigate = useNavigate();
  const [coins,setCoins]=useState(0)
  const [highscore,setHighscore]=useState(0)
  const [friends,setFriends]=useState([])

  const getCoinsAndHighScore=async()=>{

    const data = await getDocs(userCollection);
    let dbdata= data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    let c=dbdata[localStorage.getItem('userNum')].coins
    setCoins(c);
    let h=dbdata[localStorage.getItem('userNum')].highscore;
    setHighscore(h);
    let f=dbdata[localStorage.getItem('userNum')].friends
    setFriends(f)

  }

  useEffect(()=>{

    if(!localStorage.getItem('userName'))
      {
        navigate('/')
      }
    getCoinsAndHighScore()
  },[])
  return (
    <div>
      <center>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      Coins : {coins}
      <br></br>
      <br></br>
      High Score : {highscore}
      <br></br>
      <br></br>
      Friends :
      <br></br>
      <br></br>
      {friends.length!=0 ? <div>{
        
        friends.map((x)=>{
          return(
            <div>

            {x}
            </div>
          )
        })

        }
      </div>:<div>No Friends</div>}
      </center>
    </div>
  )
}

export default Home
