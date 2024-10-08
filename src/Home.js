// import React, { useState,useEffect } from 'react'



// function Home() {

//   const navigate = useNavigate();
//   const [coins,setCoins]=useState(0)
//   const [highscore,setHighscore]=useState(0)
//   const [friends,setFriends]=useState([])

//   const getCoinsAndHighScore=async()=>{

//     const data = await getDocs(userCollection);
//     let dbdata= data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
//     let c=dbdata[localStorage.getItem('userNum')].coins
//     setCoins(c);
//     let h=dbdata[localStorage.getItem('userNum')].highscore;
//     setHighscore(h);
//     let f=dbdata[localStorage.getItem('userNum')].friends
//     setFriends(f)

//   }

//   useEffect(()=>{

//     if(!localStorage.getItem('userName'))
//       {
//         navigate('/')
//       }
//     getCoinsAndHighScore()
//   },[])
//   return (
//     <div>
//       <center>
//         <br></br>
//         <br></br>
//         <br></br>
//         <br></br>
//         <br></br>
//         <br></br>
//         <br></br>
//         <br></br>
//         <br></br>
//         <br></br>
//         <br></br>
//         <br></br>
//       Coins : {coins}
//       <br></br>
//       <br></br>
//       High Score : {highscore}
//       <br></br>
//       <br></br>
//       Friends :
//       <br></br>
//       <br></br>āā
//       {friends.length!=0 ? <div>{
        
//         friends.map((x)=>{
//           return(
//             <div>

//             {x}
//             </div>
//           )
//         })

//         }
//       </div>:<div>No Friends</div>}

//       <br></br>
//       <button onClick={()=>{
//         localStorage.removeItem('userNum');
//         localStorage.removeItem('userName');
//         localStorage.removeItem('userId');
//         window.location.reload();

//       }}>Clear data from localStorage</button>
//       </center>
//     </div>
//   )
// }

// export default Home


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './Home.css';

import playIcon from './assets/play.png';
import raceIcon from './assets/race.png';
import earnIcon from './assets/earn.png';
import friendsIcon from './assets/friends.png';
import airdropIcon from './assets/airdrop.png';
import beraImage from './assets/bera.png';
import beraGif from './assets/bera.gif';
import cactusImage from './assets/cactus.png';
import FriendsPage from './Friends';
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

const GAME_WIDTH = 600;
const GAME_HEIGHT = 200;
const BERA_WIDTH = 40;
const BERA_HEIGHT = 60;
const CACTUS_WIDTH = 20;
const CACTUS_HEIGHT = 40;



function GameComponent() {
  const [beraBottom, setBeraBottom] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [cactusLeft, setCactusLeft] = useState(GAME_WIDTH);
  const [bucks, setBucks] = useState(0);
  const [totalBucks, setTotalBucks] = useState(parseInt(localStorage.getItem("coins")));
  const [maxWin, setMaxWin] = useState(parseInt(localStorage.getItem("highscore")));
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [cactusPassed, setCactusPassed] = useState(false);
  const [lastBucks, setLastBucks] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState(localStorage.getItem('userName'));
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [beraImageSrc, setBeraImageSrc] = useState(beraImage);
  const [playerRank, setPlayerRank] = useState(0);
  const gameContainerRef = useRef(null);
  const bottomNavbarRef = useRef(null);
  const [rankArray,setRankArray]=useState(JSON.parse(localStorage.getItem('rankArray')))

const userCollection = collection(db, "user");


  const dbsave=async ()=>{

    const userDoc = doc(db, "user", localStorage.getItem("userId"));
            const hscore=bucks>maxWin?bucks:maxWin
            const newFields = {chatId:localStorage.getItem('chatId'),friends:JSON.parse(localStorage.getItem('friends')),username:localStorage.getItem('userName'),otp:localStorage.getItem('otp'),highscore:hscore,referralCode:localStorage.getItem('referralCode'),coins:totalBucks };
            await updateDoc(userDoc, newFields);
            localStorage.setItem("coins",totalBucks)
            localStorage.setItem("highscore",hscore)
            window.location.reload()
  
  }
  
  const dbfetch=async ()=>{
  
    const data = await getDocs(userCollection);
    const dbdata=data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    setMaxWin(dbdata[0].highscore)
    setBucks(dbdata[0].coins)
    console.log(dbdata[0].coins)
    // setScore(data[0].coins)
  }

  const navigate = useNavigate();

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setBucks(0);
    setLastBucks(0);
    setCactusLeft(GAME_WIDTH);
    setBeraBottom(0);
    setCactusPassed(false);
    setBeraImageSrc(beraGif);
  };

  const jump = useCallback(() => {
    if (!isJumping && gameStarted && !gameOver) {
      setIsJumping(true);
      let jumpCount = 0;
      const jumpInterval = setInterval(() => {
        const gravity = 5;
        const jumpHeight = 160;
        const jumpIncrement = jumpHeight / 60;

        if (jumpCount >= 20) {
          clearInterval(jumpInterval);
          setIsJumping(false);
          setBeraBottom(0);
        } else {
          const position =
            (jumpHeight - jumpCount * jumpIncrement) *
            Math.sin((jumpCount * Math.PI) / 20);
          setBeraBottom((prevBottom) => Math.max(position, 0));
          jumpCount++;
        }
      }, 40);
    }
  }, [isJumping, gameStarted, gameOver]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        jump();
      }
    };

    const handleTouchStart = (event) => {
      if (!bottomNavbarRef.current.contains(event.target)) {
        jump();
      }
    };

    const handleClick = (event) => {
      if (!bottomNavbarRef.current.contains(event.target)) {
        jump();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('click', handleClick);
    };
  }, [jump]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const gameInterval = setInterval(() => {
        setCactusLeft((prevLeft) => {
          if (prevLeft <= -CACTUS_WIDTH) {
            setCactusPassed(false);
            return GAME_WIDTH;
          }
          return prevLeft - 5;
        });

        const beraLeft = 50;
        const beraRight = beraLeft + BERA_WIDTH;
        const cactusRight = cactusLeft + CACTUS_WIDTH;

        if (
          beraRight > cactusLeft &&
          beraLeft < cactusRight &&
          beraBottom < CACTUS_HEIGHT
        ) {
          setGameOver(true);
          setGameStarted(false);
          setShowPopup(true);

          dbsave()

          setTimeout(() => {
            setShowPopup(false);
          }, 1000); // Changed from 3000 to 500 milliseconds
        }

        if (cactusLeft < 0 && !cactusPassed) {
          setBucks((prevBucks) => prevBucks + 1);
          setCactusPassed(true);
        }
      }, 20);

      return () => clearInterval(gameInterval);
    }
  }, [cactusLeft, beraBottom, gameOver, gameStarted, cactusPassed]);

  useEffect(() => {
    if (bucks > lastBucks) {
      setTotalBucks((prevTotal) => prevTotal + (bucks - lastBucks));
      setMaxWin((prevMax) => Math.max(prevMax, bucks));
      setLastBucks(bucks);
    }
  }, [bucks, lastBucks]);

  useEffect(() => {
    if (gameOver) {
      setBeraImageSrc(beraImage);
    }
  }, [gameOver]);

  const calculatePlayerRank = async () => {
   
    const data = await getDocs(userCollection);
     
    let dbdata= data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

   dbdata.sort((a, b) => b.highscore - a.highscore);

   const index =dbdata.findIndex(item => item.username === localStorage.getItem('userName'));
   
    setPlayerRank(index !== -1 ? index + 1 : null);
  };

  const toggleLeaderboard = () => {
    if (!showLeaderboard) {
      calculatePlayerRank();
    }
    setShowLeaderboard(!showLeaderboard);
  };

  const handleNavClick = (option) => {
    if (option === 'play') {
      navigate('/');
    } else if (option === 'friends') {
      navigate('/friends');
    } else if (option === 'earn' || option === 'race' || option === 'airdrop') {
      setShowComingSoon(true);
      setTimeout(() => {
        setShowComingSoon(false);
      }, 2000);
    }
  };

  const leaderboardData = [
    { rank: 1, name: "Alice", maxWin: 100 },
    { rank: 2, name: "Bob", maxWin: 90 },
    { rank: 3, name: "Charlie", maxWin: 80 },
    { rank: 4, name: "David", maxWin: 70 },
    { rank: 5, name: "Eve", maxWin: 0 },
  ];

  const generateLeaderboardRecords = async () => {
    const data = await getDocs(userCollection);
     
    let dbdata= data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

   dbdata.sort((a, b) => b.highscore - a.highscore);

   setRankArray(dbdata)
  };

  return (
    <div className="App" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif" }}>
      <div className="player-name-container">
        <span className="player-name-text">{playerName}</span>
      </div>
      <div 
        className="game-container" 
        ref={gameContainerRef}
      >
        <div className="game-stats">
          <img src={airdropIcon} alt="Airdrop" className="airdrop-icon" />
          <span>{bucks}</span>
        </div>
        <img
          src={beraImageSrc}
          alt="Bera"
          className="bera"
          style={{
            bottom: beraBottom,
            width: BERA_WIDTH,
            height: BERA_HEIGHT,
            position: 'absolute',
            left: '50px',
          }}
        />
        <img
          src={cactusImage}
          alt="Cactus"
          className="cactus"
          style={{
            left: cactusLeft,
            width: CACTUS_WIDTH,
            height: CACTUS_HEIGHT,
            position: 'absolute',
            bottom: '0',
          }}
        />
      </div>
      <div className="game-stats-container">
        <div className="stat-item">
          <div className="total-bucks">
            <img src={airdropIcon} alt="Airdrop" className="airdrop-icon" style={{width:'40px',height:'40px'}} />
            <span>&nbsp;{totalBucks}</span>
          </div>
          <div className="max-win">Max Win: {maxWin}</div>
        </div>
      </div>
      {!gameStarted && !showPopup && (
        <div className="menu-buttons">
          <button className="start-game-button" onClick={startGame}>
            Start Game
          </button>
          <button className="leaderboard-button" onClick={toggleLeaderboard}>
            Leaderboard
          </button>
          <button className="leaderboard-button" onClick={()=>{
        localStorage.removeItem('userNum');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        window.location.reload();

      }}>Clear data from localStorage</button>
        </div>
      )}

      {showPopup && (
        <div className="popup">
          <div>Game Over!</div>
          <div>Bucks: {bucks}</div>
        </div>
      )}

      {showLeaderboard && (
        <div className="leaderboard-popup" style={{ width: GAME_WIDTH }}>
          <h2>Leaderboard</h2>
          <span 
            className="close-icon" 
            onClick={toggleLeaderboard}
          >
            &times;
          </span>
          <div className="player-info">
            <div>Name: {playerName}</div>
            <div>Rank: {playerRank}</div>
            <div>MaxWin: {maxWin}</div>
          </div>

          <div className="leaderboard-header">
            <span>Rank</span>
            <span>Name</span>
            <span>MaxWin</span>
          </div>
          <div className="leaderboard-table">
            {
             rankArray.slice(0,100).map((record, index) => (
              <div key={index} className="leaderboard-row">
                <span>{index+1}</span>
                <span>{record.username}</span>
                <span>{record.highscore}</span>
              </div>
            ))}
          </div>
          <br></br>
      
     
        </div>
      )}
      
      <div className="bottom-navbar" ref={bottomNavbarRef}>
        <div className="nav-item" onClick={() => handleNavClick('play')}>
          <img src={playIcon} alt="Play" />
          <span>Play</span>
        </div>
        <div className="nav-item" onClick={() => handleNavClick('race')}>
          <img src={raceIcon} alt="Race" />
          <span>Race</span>
        </div>
        <div className="nav-item" onClick={() => handleNavClick('earn')}>
          <img src={earnIcon} alt="Earn" />
          <span>Earn</span>
        </div>
        <div className="nav-item" onClick={() => handleNavClick('friends')}>
          <img src={friendsIcon} alt="Friends" />
          <span>Friends</span>
        </div>
        <div className="nav-item" onClick={() => handleNavClick('airdrop')}>
          <img src={airdropIcon} alt="Airdrop" />
          <span>Airdrop</span>
        </div>
      </div>

      {showComingSoon && (
        <div className="popup coming-soon">
          <div>Coming Soon!</div>
        </div>
      )}

    </div>
  );
}



function Home() {
  return (
   
       <GameComponent />
       
   
  );
}

export default Home;