import React, { useEffect, useState, useRef } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore'; // Adjust the path as needed
import { Link } from 'react-router-dom';
import styled, { keyframes } from "styled-components";
import { PiHandTap, PiTimerDuotone } from 'react-icons/pi';
import { IoCheckmarkCircleSharp, IoClose } from "react-icons/io5";
import Animate from '../Components/Animate';
import Spinner from '../Components/Spinner';
import { RiArrowRightSLine } from "react-icons/ri";
import { useUser } from '../context/userContext';
import Levels from '../Components/Levels';
import Exchanges from '../Components/Exchanges';
import { PiInfoFill } from "react-icons/pi";
import { RiSettings4Fill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import SettingsMenu from '../Components/SettingsMenu';



const userLevels = [
  { id: 1, name: 'Bronze', icon: '/bronze.webp', tapBalanceRequired: 1000 },
  { id: 2, name: 'Silver', icon: '/silver.webp', tapBalanceRequired: 50000 },
  { id: 3, name: 'Gold', icon: '/gold.webp', tapBalanceRequired: 500000 },
  { id: 4, name: 'Platinum', icon: '/platinum.webp', tapBalanceRequired: 1000000 },
  { id: 5, name: 'Diamond', icon: '/diamond.webp', tapBalanceRequired: 2500000 },
  { id: 6, name: 'Master', icon: '/master.webp', tapBalanceRequired: 5000000 },
];



const slideUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-350px);
  }
`;

const SlideUpText = styled.div`
  position: absolute;
  animation: ${slideUp} 3s ease-out;
  font-size: 2.1em;
  color: #ffffffa6;
  font-weight: 600;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  pointer-events: none; /* To prevent any interaction */
`;

const Container = styled.div`
  position: relative;
  display: flex;
  text-align: center;
  justify-content: center;
  width: 100%;
`;


const characters = [
  {
    name: 'boy',
    avatar: '/boy.webp'
  },
  {
    name: 'girl',
    avatar: '/girl.webp'
  }
];


const GoldHunters = () => {
  const imageRef = useRef(null);
  const [clicks, setClicks] = useState([]);
  const { balance, tapBalance, energy, battery, coolDownTime, tappingGuru, selectedCharacter, fullName, setFullName, characterMenu, setCharacterMenu, setSelectedCharacter, id, claimExchangePoint, setClaimExchangePoint, tapGuru, mainTap, selectedExchange, setEnergy, tapValue, setTapBalance, setBalance, refBonus, loading, initialized } = useUser();


  const [points, setPoints] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [openClaim, setOpenClaim] = useState(false);
  const exchangeRef = useRef(null);
  const [congrats, setCongrats] = useState(false)
  const [glowBooster, setGlowBooster] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  const [showExchange, setShowExchange] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [exchangePoints, setExchangePoints] = useState(0);
  const [characterSelect, setCharacterSelect] = useState(true);
  const [fullNameSelect,  setFullNameSelect] = useState(false);
  const [selectedCharacterOne, setSelectedCharacterOne] = useState({name: '', avatar: ''});
  // const fullNameOn = toString(firstName + lastName)
  const [error, setError] = useState('');


  
  const awardPoints = () => {
    const savedTime = localStorage.getItem('currentTime');
    if (savedTime) {
      const now = new Date();
      const savedDate = new Date(savedTime);

      const elapsedTime = (now - savedDate) / 1000; // Time difference in seconds
      const pointsToAward = elapsedTime * 0.8; // Points per second

      setExchangePoints(prevExchangePoints => prevExchangePoints + pointsToAward);

    }
  };


  const claimExchangePoints = async (event) => {

    if (exchangeRef.current && !exchangeRef.current.contains(event.target)) {

      const now = new Date();
      localStorage.setItem('currentTime', now.toISOString());
      const exchangeUpdated = Math.floor(exchangePoints); // Convert to integer
      const newBalance = balance + exchangeUpdated;
      const userRef = doc(db, 'telegramUsers', id.toString());
      try {
        await updateDoc(userRef, {
          balance: newBalance,
          tapBalance: tapBalance + exchangeUpdated
        });
        setBalance(newBalance)
        setTapBalance(tapBalance + exchangeUpdated)
        animateBalanceUpdate(newBalance); // Animate the balance update
        setClaimExchangePoint(false);
        setCongrats(true)
  
        setTimeout(() => {
            setCongrats(false)
        }, 4000)
      } catch (error) {
        console.error('Error updating balance exchanges', error);
      }
    }
  };

  const animateBalanceUpdate = (newBalance) => {
    const animationDuration = 300; // Animation duration in milliseconds
    const updateInterval = 20; // Update every 20 milliseconds
    const totalSteps = animationDuration / updateInterval;
    const increment = (newBalance - balance) / totalSteps; // Calculate increment per step
    let currentBalance = balance;
    let stepCount = 0;

    const intervalId = setInterval(() => {
      currentBalance += increment;
      stepCount += 1;
      if (stepCount >= totalSteps) {
        clearInterval(intervalId);
        currentBalance = newBalance;
      }
      setBalance(Math.floor(currentBalance.toFixed(0)));
    }, updateInterval);
  };


  const claimExchange = async () => {
    const now = new Date();
    localStorage.setItem('currentTime', now.toISOString());
    const exchangeUpdated = Math.floor(exchangePoints); // Convert to integer
    const newBalance = balance + exchangeUpdated;
    const userRef = doc(db, 'telegramUsers', id.toString());
    try {
      await updateDoc(userRef, {
        balance: newBalance,
        tapBalance: tapBalance + exchangeUpdated
      });
      setBalance(newBalance)
      setTapBalance(tapBalance + exchangeUpdated)
      animateBalanceUpdate(newBalance); // Animate the balance update
      setClaimExchangePoint(false);
      setCongrats(true)

      setTimeout(() => {
          setCongrats(false)
      }, 4000)
    } catch (error) {
      console.error('Error updating balance exchanges', error);
    }

  };

  useEffect(() => {
    awardPoints();
    const savedTime = localStorage.getItem('currentTime');
    console.log('Current time saved:', savedTime);
      // eslint-disable-next-line 
  }, []);

  useEffect(() => {
    if (id) {
    if (claimExchangePoint) {
      document.addEventListener('mousedown', claimExchangePoints);
    } else {
      document.removeEventListener('mousedown', claimExchangePoints);
    }
    
    return () => {
      document.removeEventListener('mousedown', claimExchangePoints);
    };
  }
    // eslint-disable-next-line 
  }, [claimExchangePoint, id]);

  function triggerHapticFeedback() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
    if (isIOS && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
      console.log('Triggering iOS haptic feedback');
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    } else if (isAndroid) {
      console.log('Android device detected');
      if ('vibrate' in navigator) {
        console.log('Vibration API supported, triggering haptic feedback');
        navigator.vibrate(50); // Vibrate for 50ms
      } else {
        console.warn('Vibration API not supported on this Android device');
      }
    } else {
      console.warn('Haptic feedback not supported on this device');
    }
  }
  

  const handleClick = (e) => {
   triggerHapticFeedback();
    if (energy <= 0 || isDisabled) {
      setGlowBooster(true); // Trigger glow effect if energy and points are 0
      setTimeout(() => {
        setGlowBooster(false); // Remove glow effect after 1 second
      }, 300);
      return; // Exit if no energy left or if clicks are disabled
    }

    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;

    const horizontalMidpoint = clientWidth / 2;
    const verticalMidpoint = clientHeight / 2;

    const animationClass =
      offsetX < horizontalMidpoint
        ? "wobble-left"
        : offsetX > horizontalMidpoint
        ? "wobble-right"
        : offsetY < verticalMidpoint
        ? "wobble-top"
        : "wobble-bottom";

    // Remove previous animations
    imageRef.current.classList.remove(
      "wobble-top",
      "wobble-bottom",
      "wobble-left",
      "wobble-right"
    );

    // Add the new animation class
    imageRef.current.classList.add(animationClass);

    // Remove the animation class after animation ends to allow re-animation on the same side
    setTimeout(() => {
      imageRef.current.classList.remove(animationClass);
    }, 500); // duration should match the animation duration in CSS

    // Increment the count
    const rect = e.target.getBoundingClientRect();
    const newClick = {
      id: Date.now(), // Unique identifier
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };



    setClicks((prevClicks) => [...prevClicks, newClick]);
    setEnergy((prevEnergy) => {
      const newEnergy = prevEnergy - tapValue.value;
      if (newEnergy <= 0) {
        // Set a timer for 1 minute
        const endTime = new Date(new Date().getTime() + coolDownTime);
        localStorage.setItem('endTime', endTime);
        localStorage.setItem('energy', newEnergy);
        setIsDisabled(true);
        const timer = setInterval(() => {
          const newTimeLeft = new Date(endTime) - new Date();
          if (newTimeLeft <= 0) {
            clearInterval(timer);
            localStorage.removeItem('endTime');
            setIsDisabled(false);
            setIsTimerVisible(false);
            setEnergy(battery.energy);
          } else {
            setTimeRemaining(newTimeLeft);
          }
        }, 1000);
        return 0; // Ensure energy does not drop below 0
      }
      return Math.max(newEnergy, 0); // Ensure energy does not drop below 0
    });
    setPoints((prevPoints) => prevPoints + tapValue.value);

    if (points === 20) {
      const taps = document.getElementById("tapmore");
      taps.style.display = "block";
      setTimeout(() => {
        taps.style.display = "none";
      }, 2000)
    }
    if (points === 80) {
      const taps = document.getElementById("tapmore2");
      taps.style.display = "block";
      setTimeout(() => {
        taps.style.display = "none";
      }, 2000)
    }
    if (points === 150) {
      const taps = document.getElementById("tapmore3");
      taps.style.display = "block";
      setTimeout(() => {
        taps.style.display = "none";
      }, 2000)
    }

    // Remove the click after the animation duration
    setTimeout(() => {
      setClicks((prevClicks) =>
        prevClicks.filter((click) => click.id !== newClick.id)
      );
    }, 1000); // Match this duration with the animation duration
  };
  const handleClickGuru = (e) => {
   triggerHapticFeedback();

    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;

    const horizontalMidpoint = clientWidth / 2;
    const verticalMidpoint = clientHeight / 2;

    const animationClass =
      offsetX < horizontalMidpoint
        ? "wobble-left"
        : offsetX > horizontalMidpoint
        ? "wobble-right"
        : offsetY < verticalMidpoint
        ? "wobble-top"
        : "wobble-bottom";

    // Remove previous animations
    imageRef.current.classList.remove(
      "wobble-top",
      "wobble-bottom",
      "wobble-left",
      "wobble-right"
    );

    // Add the new animation class
    imageRef.current.classList.add(animationClass);

    // Remove the animation class after animation ends to allow re-animation on the same side
    setTimeout(() => {
      imageRef.current.classList.remove(animationClass);
    }, 500); // duration should match the animation duration in CSS

    // Increment the count
    const rect = e.target.getBoundingClientRect();
    const newClick = {
      id: Date.now(), // Unique identifier
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };



    setClicks((prevClicks) => [...prevClicks, newClick]);
    setEnergy((prevEnergy) => {
      const newEnergy = prevEnergy - 0;
      if (newEnergy <= 0) {
        // Set a timer for 1 minute
        const endTime = new Date(new Date().getTime() + coolDownTime);
        localStorage.setItem('endTime', endTime);
        localStorage.setItem('energy', newEnergy);
        setIsDisabled(true);
        const timer = setInterval(() => {
          const newTimeLeft = new Date(endTime) - new Date();
          if (newTimeLeft <= 0) {
            clearInterval(timer);
            localStorage.removeItem('endTime');
            setIsDisabled(false);
            setIsTimerVisible(false);
            setEnergy(battery.energy);
          } else {
            setTimeRemaining(newTimeLeft);
          }
        }, 1000);
        return 0; // Ensure energy does not drop below 0
      }
      return Math.max(newEnergy, 0); // Ensure energy does not drop below 0
    });
    setPoints((prevPoints) => prevPoints + tapValue.value * tappingGuru);

    if (points === 20) {
      const taps = document.getElementById("tapmore");
      taps.style.display = "block";
      setTimeout(() => {
        taps.style.display = "none";
      }, 2000)
    }
    if (points === 80) {
      const taps = document.getElementById("tapmore2");
      taps.style.display = "block";
      setTimeout(() => {
        taps.style.display = "none";
      }, 2000)
    }
    if (points === 150) {
      const taps = document.getElementById("tapmore3");
      taps.style.display = "block";
      setTimeout(() => {
        taps.style.display = "none";
      }, 2000)
    }

    // Remove the click after the animation duration
    setTimeout(() => {
      setClicks((prevClicks) =>
        prevClicks.filter((click) => click.id !== newClick.id)
      );
    }, 1000); // Match this duration with the animation duration
  };


  const handleClaim = async () => {
    const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
    if (telegramUser) {
      const { id: userId } = telegramUser;
      const userRef = doc(db, 'telegramUsers', userId.toString());
      try {
        await updateDoc(userRef, {
          balance: balance + points,
          energy: energy,
          tapBalance: tapBalance + points
     
        });
        setBalance((prevBalance) => prevBalance + points);
        setTapBalance((prevTapBalance) => prevTapBalance + points);
        localStorage.setItem('energy', energy);

        if (energy <= 0) {
          setIsTimerVisible(true);
        }
        console.log('Points claimed successfully');
      } catch (error) {
        console.error('Error updating balance and energy:', error);
      }
    }
    openClaimer();
  };



  useEffect(() => {
    const savedEndTime = localStorage.getItem('endTime');
    if (savedEndTime) {
      const endTime = new Date(savedEndTime);
      const newTimeLeft = endTime - new Date();
      if (newTimeLeft > 0) {
        setIsDisabled(true);
        setIsTimerVisible(true);
        setTimeRemaining(newTimeLeft);
        const timer = setInterval(() => {
          const updatedTimeLeft = endTime - new Date();
          if (updatedTimeLeft <= 0) {
            clearInterval(timer);
            localStorage.removeItem('endTime');
            setIsDisabled(false);
            setIsTimerVisible(false);
            setEnergy(battery.energy);
          } else {
            setTimeRemaining(updatedTimeLeft);
          }
        }, 1000);
      } else {
        localStorage.removeItem('endTime');
      }
    }
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    if (initialized) {
      const savedEnergy = localStorage.getItem('energy');
      console.log("Energy Remaining:", savedEnergy);
      console.log("Time remaining", timeRemaining)
    }
  }, [timeRemaining, energy, initialized]);

  const closeClaimer = () => {
    setOpenClaim(false);
    setPoints(0); // Reset points after claiming
 
  };

  const openClaimer = () => {
    setOpenClaim(true)
    setCongrats(true)

    setTimeout(() => {
        setCongrats(false)
    }, 4000)

   
  }



  const formatTimeRemaining = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  // const clearTimeRemaining = () => {
  //   localStorage.removeItem('endTime');
  //   setTimeRemaining(null);
  //   setIsDisabled(false);
  //   setIsTimerVisible(false);
  // };



  const initialLevelIndex = userLevels.findIndex(level => tapBalance < level.tapBalanceRequired);
  const currentLevelIndex = initialLevelIndex === -1 ? userLevels.length - 1 : initialLevelIndex;

  const displayedLevelIndex = currentLevelIndex
  const currentLevel = userLevels[displayedLevelIndex];



  const handleCharacterSelect = async (character) => {

    setSelectedCharacterOne(character);
 

        // Optionally, show a success message
        setCharacterSelect(false);
        setFullNameSelect(true);
  //   if (id) {
  //   // Update the Firestore document
  //   const userRef = doc(db, 'telegramUsers', id.toString());
  //   await updateDoc(userRef, {
  //     character: {
  //       name: character.name,
  //       avatar: character.avatar
  //     }
  //   });

  // }

};

const handleSaveFullName = async (newBalance) => {

  
  // Check if the fullName field is empty
  if (!fullName.trim()) {
    setError('Enter a name to proceed');
    return;
  }

  const saveCharacter = selectedCharacterOne;
  
  if (id) {
    try {
      // Update the Firestore document
      newBalance = balance + 100;
      const userRef = doc(db, 'telegramUsers', id.toString());
      await updateDoc(userRef, {
        fullName: fullName,
        character: {
          name: saveCharacter.name,
          avatar: saveCharacter.avatar
        },
        balance: newBalance,
        tapBalance: newBalance,
      });

      setCharacterMenu(false);
      animateBalanceUpdate(newBalance); // Animate the balance update
      setBalance(newBalance);
      setTapBalance(newBalance);
      setSelectedCharacter({ name: saveCharacter.name, avatar: saveCharacter.avatar });
      setCongrats(true);

      setTimeout(() => {
        setCongrats(false);
      }, 4000);

      // Clear the error message if the update is successful
      setError('');
    } catch (error) {
      console.error('Error updating document:', error);
      setError('Failed to update user information. Please try again.');
    }
  }
  console.log('Character Image is:', saveCharacter);
};

useEffect(() => {
  console.log('CHARACTER IS:', selectedCharacter)
})

  return (
<>
      {loading ? (
        <Spinner />
      ) : (
  
      <Animate>
         
    <div className='w-full flex justify-center flex-col space-y-3'>
       {/* <Spinner /> */}
    <div className='w-full flex items-center space-x-[6px] px-5'>
          <div className='w-[30px] h-[30px] bg-cards rounded-[8px] p-[6px] overflow-hidden flex items-center justify-center relative'>
            <img src={selectedCharacter.avatar} className='w-[25px] mt-[6px]' alt={fullName || "user"}/>

          </div>

          <h1 className='text-[11px] font-semibold'>
            {fullName} (CEO)
          </h1>

        </div>

      <div className='w-full flex justify-between items-center px-4 z-10 pb-[2px] pt-1'>

        <div className='w-[32%] flex flex-col space-y-1 pr-4'>

          <div className='w-full flex justify-between text-[10px] font-medium items-center'>

            <span className='levelName flex items-center'>
               <span onClick={() => setShowLevel(true)} className=''>{currentLevel.name}</span> 
                <span className='flex items-center'>  <RiArrowRightSLine size={12} className='mt-[1px]'/> </span>
            </span>

            <span className=''>

          {currentLevel.id}/{userLevels.length}
              

            </span>
          </div>

            <div className='flex w-full mt-2 items-center bg-[#56565630] rounded-[10px] border-[1px] border-[#49494952]'>
       

       <div className={`h-[6px] rounded-[8px] levelbar`} style={{ width: `${(tapBalance / currentLevel.tapBalanceRequired) * 100}%` }}/> 
       </div>

        </div>




        <div className='flex w-[60%] bg-[#5c5c5c52] border-[1px] border-[#434343] h-[40px] mb-[-4px] py-3 px-3 rounded-full items-center'>


            <button onClick={() => setShowExchange(true)} className=''>
                <img id={selectedExchange.id} src={selectedExchange.icon} alt={selectedExchange.name} className={`w-[22px]`}/>
            </button>

            <div className='w-[1px] h-[18px] mx-[10px] bg-divider2'/>
            <div className='flex flex-1 flex-col space-y-1 items-center justify-center'>
              <p className='text-[9px]'>
                Profit per tap
              </p>
              <div className='flex items-center justify-center space-x-1 text-[11px]'>

              <span className='flex items-center justify-center'>
                <img src='/coin.webp' alt='ppf' className='w-[12px]'/>
                  </span>
                <span className='font-bold'>
                  +{tapValue.value}
                </span>
                <span className='flex items-center justify-center'>
              <PiInfoFill size={14} className='text-info'/>
                </span>

              </div>

            </div>

            <div className='w-[1px] h-[18px] mx-[10px] bg-divider2'/>
            
            <button onClick={() => setShowSetting(true)} className=''>
              <RiSettings4Fill size={20} className=''/>
            </button>

        </div>


      </div>


      <div className='w-full relative h-screen bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px]'>
        <div id="refer" className='w-full h-screen homescreen rounded-tl-[40px] rounded-tr-[40px] mt-[2px] px-5'>

        <div className='w-full flex flex-col scroller h-[80vh] overflow-y-auto pb-[150px]'>
        <div className='w-full flex items-center justify-center space-x-5 py-6'>
        <div className='bg-cards3 text-[#dddddd] py-[15px] px-5 w-[45%] flex justify-center space-x-1 items-center rounded-[6px] text-[15px] font-medium'>
          <span className='text-[16px]'>
            <PiHandTap size={18} className='tesxt-[#bcbcbc] text-btn4'/>
          </span>
          {isTimerVisible ? (
                    <span>
                    wait for refill
                      </span>

                      ) : (
                        <span className='text-nowrap'>
                        {energy} taps left</span>
                      )}   
        </div>
        <div className='bg-cards3 py-[15px] px-5 text-[#dddddd] font-medium w-[45%] flex justify-center space-x-1 items-center rounded-[6px] text-[15px]'>
          <span className='text-[16px]'>
            <PiTimerDuotone size={18} className='text-btn4' />
          </span>
          {isTimerVisible ? (
            <span className='text-nowrap'>{`${formatTimeRemaining(timeRemaining)}`}</span>
          ) : (
            <span>
            tap now
            </span>
          )}        
        </div>
      </div>
      <h1 className='flex w-full justify-center items-center space-x-1 pb-2'>
        <img src='/loader.webp'className='w-[30px]' alt='engagecoin'/>
         <span className='text-[#fff] text-[32px] font-bold'>
           <span className='pl-[2px]'>{formatNumber(balance + refBonus)} <span className='text-btn4'>MAX</span></span>
        </span>
      </h1>
      <div>


    </div>



      <div className='w-full flex justify-center items-center py-6 clickContainer'>
      <div class={`${tapGuru ? 'block' : 'hidden'} pyro`}>
  <div class="before"></div>
  <div class="after"></div>
</div>
      <div className="w-[350px] relative flex items-center justify-center">

      <img src='/lihgt.webp'
                alt='err' className={`absolute w-[276px] rotate-45 ${tapGuru ? 'block' : 'hidden'}`}/>


        {mainTap && (
           <Container>
            <img
              onPointerDown={handleClick}
              ref={imageRef}
              src="/maxitap.webp"
              alt="Wobble"
              className={`wobble-image select-none`}
            />
            {clicks.map((click) => (
              <SlideUpText key={click.id} x={click.x} y={click.y}>
                +{tapValue.value}
              </SlideUpText>
            ))}
            <span id="tapmore" className='bg-[#333333b0] hidden tapmore p-[6px] rounded-[6px] absolute top-0 right-0'>
              tap morre!
            </span>
            <span id="tapmore2" className='bg-[#333333b0] hidden tapmore p-[6px] rounded-[6px] absolute top-0 left-0'>
              wo hoo! let's go!
            </span>
            <span id="tapmore3" className='bg-[#333333b0] hidden tapmore p-[6px] rounded-[6px] absolute top-[-10px] left-[30%]'>
              tap! tap! tap!!
            </span>
          </Container>
        )}

        {tapGuru && (
           <Container>
            <img
              onPointerDown={handleClickGuru}
              ref={imageRef}
              src="/maxitap.webp"
              alt="Wobble"
              className={`wobble-image select-none`}
            />
            {clicks.map((click) => (
              <SlideUpText key={click.id} x={click.x} y={click.y}>
                +{tapValue.value * tappingGuru}
              </SlideUpText>
            ))}
            <span id="tapmore" className='bg-[#333333b0] hidden tapmore p-[6px] rounded-[6px] absolute top-0 right-0'>
              tap morre!
            </span>
            <span id="tapmore2" className='bg-[#333333b0] hidden tapmore p-[6px] rounded-[6px] absolute top-0 left-0'>
              wo hoo! let's go!
            </span>
            <span id="tapmore3" className='bg-[#333333b0] hidden tapmore p-[6px] rounded-[6px] absolute top-[-10px] left-[30%]'>
              tap! tap! tap!!
            </span>
          </Container>
        )}


        </div>
      </div>

      <div className='w-full flex justify-center'>
      <div className={`${glowBooster === true ? "glowbutton" : ""} w-full flex justify-between items-center bg-cards3 rounded-[15px] py-3 px-4`}>

      {energy === 0 && points === 0 ? (
             <>
             <p className='text-[#dedede] py-2 text-[14px] moreTaps font-medium pr-3'>
              Need more taps? Get boosters now!
             </p>
            <Link 
              to="/boost"
              className='bg-btn4 getBoosters text-[#000] py-[14px] px-5 text-nowrap rounded-[12px] font-bold text-[15px]'
            >
              Get Boosters
            </Link>
           </>
          ) : (
            <>
          <span className='text-[#fff] font-semibold text-[24px]'>
            <span className='pl-[2px]'>{points} <span className='text-btn4'>MAX</span></span>
          </span>
          <button 
            onClick={handleClaim} 
            disabled={points === 0} 
            className={`${points === 0 || openClaim ? 'text-[#ffffff71] bg-btn2' : 'bg-btn4 text-[#000]'} py-[14px] px-8 rounded-[12px] font-bold text-[16px]`}
          >
            Claim
          </button>
          </>
          )}

        </div>
      </div>

      </div>
      </div>

      {/* Claim Modal */}
      <div className='w-full absolute top-[50px] flex justify-center z-50 pointer-events-none select-none'>
      {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]"/>) : (<></>)}
      </div>



      <div
        className={`${
          openClaim === true ? "visible" : "invisible"
        } fixed top-[-12px] claimdiv bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex flex-col justify-center items-center px-4`}
      >
 
        <div className={`${
          openClaim === true ? "opacity-100 mt-0" : "opacity-0 mt-[100px]"
        } w-full bg-modal rounded-[16px] relative flex flex-col ease-in duration-300 transition-all justify-center p-8`}>
      

          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
              <IoCheckmarkCircleSharp size={32} className='text-accent'/>
              <p className='font-medium'>Let's go!!</p>
            </div>
            <h3 className="font-medium text-[24px] text-[#ffffff] pt-2 pb-2">
              <span className='text-accent'>+{points}</span> MAX
            </h3>
            <p className="pb-6 text-[#bfbfbf] text-[15px] w-full text-center">
              Keep grinding! something huge is coming! Get more MAX ow! 
            </p>

            <div className="w-full flex justify-center">
            <button
              onClick={closeClaimer}
              className="bg-btn4 w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
              Tap Morrre!
            </button>
          </div>
          </div>
          </div>

        </div>


         

        {selectedExchange.id === 'selectex' || exchangePoints < 50 ? (
          <>
          </>
        ) : (
        <div className={`${claimExchangePoint ? 'flex' : 'hidden'} fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#303030c4] flex-col justify-end items-center`}>


        <div ref={exchangeRef} className={`w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center`}>
      

          <div className="w-full flex bg-[#202020] rounded-tl-[40px] rounded-tr-[40px] mt-[2px] justify-center relative flex-col items-center space-y-3 p-4 pt-20 pb-10">
         
          <button
          onClick={claimExchange}
           className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-[#383838] absolute right-6 top-4 text-center font-medium text-[16px]"
                    >
                     <IoClose size={20} className="text-[#9995a4]"/>
                    </button>

         <div className='w-full bg-cards rounded-[16px] relative px-4 flex flex-col justify-center items-center'>

            <div className="w-[68px] h-[68px] -mt-[34px] rounded-full border-[2px] border-[#1F1F1F] bg-[#3b3b3b] items-center justify-center flex flex-col space-y-2">
             <img src={selectedExchange.icon} alt={selectedExchange.name} className='w-[32px]'/>
           
            </div>
            <div className='w-full items-center flex pt-1 justify-center space-x-[6px]'>
              <img src='/coin.webp' alt='coin' className='w-[36px]'/>
            <h3 className="font-bold text-[36px] text-[#ffffff] pt-2 pb-3 mt-[4px]">
              <span className='text-accent'>{formatNumber(exchangePoints.toFixed(0))}</span>
            </h3>
            </div>

            <p className="pb-6 text-[#bfbfbf] font-semibold px-8 text-[17px] w-full text-center">
          The exchange has started working for you
            </p>
            </div>
            <div className="w-full flex justify-center pb-7">
            <button
              onClick={claimExchange}
              className="bg-btn4 w-full py-[18px] px-6 text-nowrap flex items-center justify-center text-center rounded-[12px] font-semibold text-[17px]"
            >
              Thank you, {selectedExchange.name} <FaHeart size={17} className='mt-[2px] pl-1'/>
            </button>
          </div>
          </div>
          </div>
        </div>
        )}



<div 
        className={`${
          characterMenu=== true && selectedCharacter.name==='' ? "visible" : "invisible"
        } fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-end backdrop-blur-[10px]`}
      >

<div className={`w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center`}>
      

      <div className="w-full flex bg-[#202020] rounded-tl-[40px] rounded-tr-[40px] mt-[2px] h-[85vh] justify-start relative flex-col items-center space-y-3 p-4 pb-24">

              <div className="w-full flex flex-col text-center space-y-5 justify-center items-center py-8 relative">

<h1 className='font-semibold text-[18px]'> 
          Welcome to the <br/> land of Gold & Riches!
</h1>

<p className='text-[13px] px-6'>
  Explore and earn your way up to riches and wealth!
</p>
   


      {characterSelect && (

  <>

<h1 className='font-medium text-[14px] text-accent'>
  Choose Character
</h1>


<div className='w-full flex items-center justify-center space-x-5'>



{characters.map((character) => (
  <div className='w-[110px] h-[110px] relative flex items-center justify-center'>


          <div
            key={character.name}
            onClick={() => handleCharacterSelect(character)}
            className='w-[110px] h-[110px] bg-cards cursor-pointer hover:scale-[1.1] ease-in duration-300 rounded-full overflow-hidden relative items-center justify-center flex'
          >
            <img src={character.avatar} alt={character.name} className='w-[70px] h-[90px] object-cover absolute bottom-0 object-top' />
          </div>
          <div class="w-[6px] absolute bottom-[-24px] h-[6px] bg-white rounded-full animate-pulse"></div>

          </div>
        ))}

</div>
</>
      )}

      {fullNameSelect && (
        <>

<h1 className='font-medium text-[14px] text-accent'>
  Set your name to continue
</h1>

<div className="w-full flex flex-col items-center space-y-3 px-6">
{error && <p style={{ color: 'red' }}>{error}</p>}
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full py-4 rounded-[8px] bg-cards flex justify-center text-center text-[16px] focus:outline-none outline-none border-none"
              value={fullName}
            
              onChange={(e) => setFullName(e.target.value)}
            />
            <div className='w-full px-6'>

            <button
              className="px-6 w-full py-3 text-[15px] bg-accent text-[#000] font-semibold rounded-lg"
              onClick={handleSaveFullName}
            >
            Contine to GoldCity
            </button>
            </div>
          </div>
          </>
      )}


</div>

              </div>
            </div>
            </div>



      </div>
      <Levels showLevel={showLevel} setShowLevel={setShowLevel} />
      <Exchanges showExchange={showExchange} setShowExchange={setShowExchange} />
      <SettingsMenu showSetting={showSetting} setShowSetting={setShowSetting} />

    </div>
</Animate>
      )}
</>
  );
};

export default GoldHunters;