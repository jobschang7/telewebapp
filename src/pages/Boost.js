import React, { useEffect, useRef, useState } from "react";
import Animate from "../Components/Animate";
import { Outlet, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { db } from '../firebase/firestore';
import { useUser } from "../context/userContext";
import { PiRocketLaunchFill } from "react-icons/pi";
import { GiMagicPalm } from "react-icons/gi";
import { MdBatteryCharging90 } from "react-icons/md";
// import { IoIosFlash } from "react-icons/io";
import { RiArrowRightSLine } from "react-icons/ri";
import Levels from "../Components/Levels";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { doc, updateDoc } from 'firebase/firestore';
import { IoClose } from "react-icons/io5";
import { ImFire } from "react-icons/im";
import { IoIosFlash } from "react-icons/io";
import { FaRobot } from "react-icons/fa6";



const userLevels = [
  { id: 1, name: 'Bronze', icon: '/bronze.webp', tapBalanceRequired: 1000 },
  { id: 2, name: 'Silver', icon: '/silver.webp', tapBalanceRequired: 50000 },
  { id: 3, name: 'Gold', icon: '/gold.webp', tapBalanceRequired: 500000 },
  { id: 4, name: 'Platinum', icon: '/platinum.webp', tapBalanceRequired: 1000000 },
  { id: 5, name: 'Diamond', icon: '/diamond.webp', tapBalanceRequired: 2500000 },
  { id: 6, name: 'Master', icon: '/master.webp', tapBalanceRequired: 5000000 },
];



const tapValues = [
  {
    level: 1,
    value: 1,
  },
  {
    level: 2,
    value: 2,
  },
  {
    level: 3,
    value: 3,
  },
  {
    level: 4,
    value: 4,
  },
  {
    level: 5,
    value: 5,
  },
  {
    level: 6,
    value: 6,
  },
  {
    level: 7,
    value: 7,
  },
  {
    level: 8,
    value: 8,
  },
  {
    level: 9,
    value: 9,
  },
  {
    level: 10,
    value: 10,
  },
  {
    level: 11,
    value: 11,
  },
  {
    level: 12,
    value: 12,
  },
  {
    level: 13,
    value: 13,
  },
  {
    level: 14,
    value: 14,
  },
];

const energyValues = [
  {
    level: 1,
    energy: 500,
  },
  {
    level: 2,
    energy: 1000,
  },
  {
    level: 3,
    energy: 1500,
  },
  {
    level: 4,
    energy: 2000,
  },
  {
    level: 5,
    energy: 2500,
  },
  {
    level: 6,
    energy: 3000,
  },
  {
    level: 7,
    energy: 3500,
  },
  {
    level: 8,
    energy: 4000,
  },
  {
    level: 9,
    energy: 4500,
  },
  {
    level: 10,
    energy: 5000,
  },
  {
    level: 11,
    energy: 5500,
  },
  {
    level: 12,
    energy: 6000,
  },
  {
    level: 13,
    energy: 6500,
  },
  {
    level: 14,
    energy: 7000,
  },
];


const upgradeCosts = [0, 2000, 5000, 10000, 50000, 100000, 300000, 500000, 1000000, 1500000, 2500000, 3000000, 5000000, 7000000];


const energyUpgradeCosts = [0, 3000, 6000, 30000, 100000, 200000, 3000000, 5000000, 1000000, 2000000, 3000000, 4000000, 5000000, 7000000];


const Boost = () => {
  const { level, balance, id, tapValue, setTapValue, setMainTap, tapBalance, startTimer, setTapGuru, setFreeGuru, freeGuru, battery, setEnergy, setBattery, setBalance, refBonus } = useUser();
  const [showLevel, setShowLevel] = useState();
  const [openInfo, setOpenInfo] = useState(false);
  const [openInfoTwo, setOpenInfoTwo] = useState(false);
  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);
  const [isUpgradeModalVisibleEn, setIsUpgradeModalVisibleEn] = useState(false);
  const [congrats, setCongrats] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isUpgradingEn, setIsUpgradingEn] = useState(false);
  const [guru, setGuru] = useState(false);
  const location = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);


  const infoRef = useRef(null);
  const infoRefTwo = useRef(null);

  const handleClickOutside = (event) => {
    if (infoRef.current && !infoRef.current.contains(event.target)) {
      setOpenInfo(false);
    }
    if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
      setOpenInfoTwo(false);
    }
  };

  useEffect(() => {
    if (openInfo || openInfoTwo) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openInfo, openInfoTwo]);

  const openit = () => {
    setOpenInfo(true);
  }

  // const formatNumber = (num) => {
  //   if (num < 100000) {
  //     return new Intl.NumberFormat().format(num).replace(/,/g, " ");
  //   } else if (num < 1000000) {
  //     return new Intl.NumberFormat().format(num).replace(/,/g, " K");
  //   } else {
  //     return (num / 1000000).toFixed(3).replace(".", ".") + " M";
  //   }
  // };


  const formatNumber = (number) => {
    if (number === undefined || number === null || isNaN(number)) {
      return '';
    }
  
    if (number >= 1000000) {
      return (number / 1000000).toFixed() + 'M';
    } else if (number >= 100000) {
      return (number / 1000).toFixed(0) + 'K';
    } else {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  };

  const handleUpgrade = async () => {
    if (isUpgrading) return; // Prevent multiple clicks
    setIsUpgrading(true);
    const nextLevel = tapValue.level;
    const upgradeCost = upgradeCosts[nextLevel];
    if (nextLevel < tapValues.length && (balance + refBonus) >= upgradeCost && id) {
      const newTapValue = tapValues[nextLevel];
      const userRef = doc(db, 'telegramUsers', id.toString());
      try {
        await updateDoc(userRef, {
          tapValue: newTapValue,
          balance: balance - upgradeCost
        });
        setTapValue(newTapValue);
        setBalance((prevBalance) => prevBalance - upgradeCost);
        setIsUpgrading(false);
        setIsUpgradeModalVisible(false);
        setCongrats(true)
        setIsDisabled(true);
        setTimeout(() => {
            setCongrats(false)
            setIsDisabled(false);
        }, 4000)
        console.log('Tap value upgraded successfully');
      } catch (error) {
        console.error('Error updating energy value:', error);
      } finally {
        setIsUpgrading(false); // Re-enable the button
      }
    } else {
      setIsUpgrading(false); // Re-enable the button if conditions are not met
    }

  };

  const handleEnergyUpgrade = async () => {
    if (isUpgradingEn) return; // Prevent multiple clicks
    setIsUpgradingEn(true);
    
    const nextEnergyLevel = battery.level;
    const energyUpgradeCost = energyUpgradeCosts[nextEnergyLevel];
  
    if (nextEnergyLevel < energyValues.length && (balance + refBonus) >= energyUpgradeCost && id) {
      const newEnergyValue = energyValues[nextEnergyLevel];
      const userRef = doc(db, 'telegramUsers', id.toString());
  
      try {
        await updateDoc(userRef, {
          battery: newEnergyValue,
          balance: balance - energyUpgradeCost,
          energy: newEnergyValue.energy,
        });
  
        setBattery(newEnergyValue);
        localStorage.setItem('energy', newEnergyValue.energy);
        setEnergy(newEnergyValue.energy);
        setBalance((prevBalance) => prevBalance - energyUpgradeCost);
        
        setIsUpgradeModalVisibleEn(false);
        setIsDisabled(true);
        setCongrats(true);
        setTimeout(() => {
          setCongrats(false);
          setIsDisabled(false);
        }, 4000);
  
        console.log('Energy value upgraded successfully');
        console.log('Energy value upgraded successfully +', newEnergyValue.value);
      } catch (error) {
        console.error('Error updating energy value:', error);
      } finally {
        setIsUpgradingEn(false); // Re-enable the button
      }
    } else {
      setIsUpgradingEn(false); // Re-enable the button if conditions are not met
    }
  };
  

  const nextUpgradeCost = upgradeCosts[tapValue.level];
  const hasSufficientBalance = (balance + refBonus) >= nextUpgradeCost;

  const nextEnergyUpgradeCost = energyUpgradeCosts[battery.level];
  const hasSufficientBalanceEn = (balance + refBonus) >= nextEnergyUpgradeCost;


  const handleTapGuru = async () => {
    if (id) {
      if (freeGuru > 0) {
        try {
          const newRemainingClicks = freeGuru - 1;
          setFreeGuru(newRemainingClicks);
  
          // Update the Firestore document
          const userRef = doc(db, 'telegramUsers', id.toString());
          await updateDoc(userRef, {
            freeGuru: newRemainingClicks,
            timeSta: new Date(),
          });
          
          startTimer();
          setMainTap(false);
          setTapGuru(true);
          location('/'); // Navigate to /home without refreshing the page
          setCongrats(true);
          setIsDisabled(true);
          setTimeout(() => {
            setCongrats(false);
            setIsDisabled(false);
          }, 2000);
        } catch (error) {
          console.error('Error updating Firestore document:', error);
        }
      } else {
        setIsDisabled(true);
      }
    }
  };
  

  const calculateTimeRemaining = () => {
    const now = new Date();
    const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeDiff = nextDate - now;
  
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
    return { hours, minutes, seconds };
  };
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);



  const initialLevelIndex = userLevels.findIndex(level => tapBalance < level.tapBalanceRequired);
  const currentLevelIndex = initialLevelIndex === -1 ? userLevels.length - 1 : initialLevelIndex;

  const displayedLevelIndex = currentLevelIndex
  const currentLevel = userLevels[displayedLevelIndex];



  return (
    <>

        <Animate>
        <div className="w-full pt-0 justify-center flex-col space-y-3">

        <div className='w-full flex justify-between px-4'>

<button onClick={() => setShowLevel(true)} className='w-[55%] flex space-x-1 items-center'>
          <span className='flex items-center justify-center'>
              
      <img alt="daxy" src={level.imgUrl} className='w-[16px] levelImg h-full'/>

      </span>
      <span className='levelName font-medium text-secondary text-[15px] flex items-center space-x-1'>
         <span className='text-[15px]'> {level.name}</span> 
          <span className='flex items-center'>  <RiArrowRightSLine size={18} className=''/> </span>
      </span>
  </button>




    <div className='w-fit py-[2px] px-3 flex items-center space-x-1 justify-center border-[1px] border-cards rounded-[25px]'>
      <span className='w-[14px] levelImg'>
        <img alt="daxy" src='/loader.webp' className='w-full' />
      </span>
      <h1 className="text-[15px] font-bold">
        {formatNumber(balance + refBonus)}
      </h1>
    </div>

    </div>

<div className="pb-1 px-4">
        <h1 className='text-[24px] font-semibold pb-1'>
              Buy Boosters
            </h1>
            <p className='text-[14px] leading-[24px] pr-6'>
            Purchase boosters & earn more tokens!
            </p>
            </div>


            <div className='w-full relative h-screen bg-divider shadowtop border-[0.5px] border-transparent bordercut rounded-tl-[40px] rounded-tr-[40px]'>
        <div id="refer" className='w-full h-screen homescreen rounded-tl-[40px] rounded-tr-[40px] mt-[2px] px-5 pt-1'>

        <div className="w-full flex flex-col overflow-y-auto pb-[100px] h-[80vh] scroller">
        <div className="w-full flex items-center justify-between space-x-4 pt-7 pb-4">

          <button
           onClick={() => setIsUpgradeModalVisible(true)}  
           disabled={tapValue.level >= tapValues.length} 
            className="w-[48%] h-[120px] justify-center p-3 flex flex-col space-y-1 bg-cards3 rounded-[12px]">
            <div className="flex space-x-2">
            <GiMagicPalm size={45} className="text-accent2 boostImg"/>
            <span className="font-medium boostTitle text-[15px] items-start text-left flex flex-col space-y-[2px]">
             <span className=""> Multitap</span>
             <p className="text-[11px] text-[#d0d0d0] text-left">
              Level {tapValue.level}
             </p>
            </span>

            </div>
            <span className="text-cardtext boostAmount font-semibold text-[24px] pl-1 flex items-center justify-between w-full">
            <span>{tapValue.level >= tapValues.length ? (
              <>
              MAX
              </>
            ) : (
              <>
              {formatNumber(nextUpgradeCost)}
              </>
            )} </span>
            <MdOutlineKeyboardArrowRight size={30} className='text-[#959595]' />
            </span>

          </button>
          <button
                      onClick={() => setIsUpgradeModalVisibleEn(true)} 
                      disabled={battery.level >= energyValues.length} 
                       className="w-[48%] h-[120px] justify-center p-3 flex flex-col space-y-1 bg-cards3 rounded-[12px]">
            <div className="flex space-x-2">
            <MdBatteryCharging90 size={45} className="text-accent2 boostImg"/>
            <span className="font-medium boostTitle text-[15px] items-start text-left flex flex-col space-y-[2px]">
             <span> Tap Limit</span>
             <p className="text-[11px] text-[#d0d0d0] text-left">
              Level {battery.level}
             </p>
            </span>

            </div>
            <span className="text-cardtext boostAmount font-semibold text-[24px] pl-1 flex items-center justify-between w-full">
            <span>

            {battery.level >= energyValues.length ? (
              <>
              MAX
              </>
            ) : (
              <>
              {formatNumber(nextEnergyUpgradeCost)}
              </>
            )} 
              
              
              </span>
            <MdOutlineKeyboardArrowRight size={30} className='text-[#959595]' />
            </span>

          </button>

        </div>

      {/*  */}
      <div className="w-full flex-col space-y-4">

    <button 
                  disabled={freeGuru <= 0}
                  onClick={() => setGuru(true)}
     class={`${freeGuru > 0 ? 'opacity-100' : 'opacity-[.5]'} isolate cardios bg-cards3 w-full rounded-xl relative overflow-hidden p-3 z-10`}>

      {/* <div className="backdrop-blur-[10px] bg-cards absolute left-0 right-0 top-0 bottom-0 z-0 pointer-events-none"/> */}


      <div className="flex space-x-2 w-full relative">
            <ImFire size={45} className={`${freeGuru > 0 ? '' : 'grayscale-[1]'} text-btn4 boostImg`}/>
              <div className="w-full flex justify-between items-center">

    
            <div className="font-medium boostTitle text-[15px] flex-1 items-start text-left flex flex-col space-y-[2px]">
             <span> Tapping Guru</span>
             <span className="text-[11px] text-[#d0d0d0] text-left flex items-center space-x-1">
            <span>
              Boost points
              </span> 
              <span className="not-italic text-[11px] text-[#d5d5d5] flex items-center">
            <span>x5</span>
            <IoIosFlash size={10} className=""/>
            </span>
             </span>
             <span className="text-btn4 boostAmount font-medium flex items-center justify-between w-full">
            <span className="text-[14px]"> 
            {freeGuru > 0 ? (
   <span className="tapguru2">{freeGuru}/3 boosts left</span>
                      ) : (
                        <span className="tapguru2">      
                      {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                      </span>
                      )}
            </span>
         
            </span>
       
            </div>
            <MdOutlineKeyboardArrowRight size={30} className='text-[#959595]' />
            </div>

            </div>

      
    </button>

    {/*  */}

    <div onClick={openit} class="isolate cardios aspect-video w-full rounded-xl relative overflow-hidden p-6 z-10">
   

   <div className="backdrop-blur-[10px] bg-cards absolute left-0 right-0 top-0 bottom-0 z-0 pointer-events-none"/>

   <div className="flex w-full flex-col relative z-10 space-y-1">
<div className="flex justify-between">

   <PiRocketLaunchFill size={40} className="text-accent2 xxImg"/>
   <IoMdInformationCircleOutline size={20} className="text-secondary"/>

</div>

     <h4 className="text-[16px] xxTitle text-[#f2f2f2] font-semibold uppercase">
       Balance boost card
     </h4>
     <span className="text-[26px] xxAmount text-primary font-semibold flex items-center space-x-2">
       <span>{formatNumber(balance + refBonus)}</span>
       <span className="not-italic text-[16px] mt-1 text-accent flex items-center">
         <span>x2</span>
         <IoIosFlash size={20} className=""/>
         </span>
     </span>

     <button className="text-btn4 py-1 px-3 bg-[#ffffff14] rounded-[5px] font-medium text-[13px] w-fit">
       Coming soon...
     </button>

   </div>
   
 </div>

 {/*  */}

    <button onClick={() => setOpenInfoTwo(true)} className="w-full justify-center p-3 flex flex-col space-y-1 bg-cards3 rounded-[12px]">
    <div className="w-full flex justify-between items-center">
            <div className="flex space-x-2 w-full">
            <FaRobot size={45} className="text-btn4 boostImg"/>
            <div className="font-medium boostTitle text-[15px] flex-1 items-start text-left flex flex-col space-y-[2px]">
             <span> Tapping Bot</span>
             <p className="text-[11px] text-[#d0d0d0] text-left">
              Auto tap every 3 hours
             </p>
             <span className="text-btn4 boostAmount font-medium flex items-center justify-between w-full">
            <span className="text-[14px]"> 2 000 000</span>
            </span>
            </div>

            </div>
            <MdOutlineKeyboardArrowRight size={30} className='text-[#959595]' />

            </div>


          </button>

      </div>


      </div>
      </div>
      </div>


      <div
        className={`${
          guru=== true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
  

    <div className={`${
          guru === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2 relative">
            <button
                      onClick={() =>  setGuru(false)}
                      className="flex items-center justify-center absolute right-0 top-0 text-center rounded-[12px] font-medium text-[16px]"
                    >
                     <IoClose size={24} className="text-[#9a96a6]"/>
                    </button>

                    <div className="w-full items-center justify-center flex flex-col pt-[20px]">
                    <ImFire size={55} className='text-accent'/>

                  </div>
                  <h3 className="font-medium text-[22px] pt-2 !mt-[2px]">
              Tapping Guru
            </h3>
            </div>
            <span className="flex items-center space-x-1 !mt-[4px]">
                  <span className="flex items-center"> <img alt="daxy" src='https://ucarecdn.com/8b43a50a-7638-4cde-9a70-b2a1d612c98b/engagesmall.webp' className='w-[18px]' /></span>
                 <span className='font-semibold text-[17px]'>Free</span>
                 </span> 
            <p className="pb-6 text-[#bfbfbf] text-[15px] w-full text-center">
            Multiply your tap income by x5 for 20 seconds. Do not use taps while active.
            </p>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={handleTapGuru}
              disabled={isDisabled}
              className="bg-btn4 w-full py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
            Get it!
            </button>
          </div>
        </div>
      </div>

      {/*  */}

      <div 
        className={`${
          openInfoTwo=== true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
  

    <div ref={infoRefTwo} className={`${
          openInfoTwo === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
          <div className="w-full flex justify-center flex-col items-center space-y-3">
          <div className="w-full items-center justify-center flex flex-col pt-[20px]">
                    <FaRobot size={55} className='text-accent'/>

                  </div>
                  <h3 className="font-medium text-[22px] pt-2 !mt-[2px]">
              Auto Tap Bot
            </h3>
            <span className="flex items-center space-x-1 !mt-[4px]">
                  <span className="flex items-center"> <img alt="daxy" src='https://ucarecdn.com/8b43a50a-7638-4cde-9a70-b2a1d612c98b/engagesmall.webp' className='w-[18px]' /></span>
                 <span className='font-semibold text-[17px]'>2 000 000</span>
                 </span> 
            <p className="pb-6 text-[#bfbfbf] text-[15px] w-full text-center">
            Tap Bot will tap when your energy is full <br/>
            Max bot work duration is 3 hours
                        </p>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={() => setOpenInfoTwo(false)}
              className="bg-btn2 text-[#959595] w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
              Insufficient balance
            </button>
          </div>
        </div>
      </div>

      <div className='w-full absolute top-[50px] left-0 right-0 flex justify-center z-50 pointer-events-none select-none'>
      {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]"/>) : (<></>)}
      </div>



               {/* Upgrade Modal */}
               <div
              className={`${
                isUpgradeModalVisible ? "visible" : "invisible"
              } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
            >
              <div className={`${
                isUpgradeModalVisible ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
              } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
                <div className="w-full flex justify-center flex-col items-center space-y-3">
                <button
                      onClick={() =>  setIsUpgradeModalVisible(false)}
                      className="flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]"
                    >
                     <IoClose size={24} className="text-[#9a96a6]"/>
                    </button>
                  <div className="w-full items-center justify-center flex flex-col pt-[20px]">
                    <GiMagicPalm size={55} className='text-accent'/>

                  </div>
                  <h3 className="font-medium text-[22px] pt-2 !mt-[2px]">
              Multitap level <span className='text-accent'>{tapValues[tapValue.level]?.value}</span>
            </h3>
            <span className="flex items-center space-x-1 !mt-[4px]">
                  <span className="flex items-center"> <img alt="daxy" src='https://ucarecdn.com/8b43a50a-7638-4cde-9a70-b2a1d612c98b/engagesmall.webp' className='w-[18px]' /></span>
                 <span className='font-semibold text-[17px]'>{formatNumber(nextUpgradeCost)}</span>
                 </span> 

                  <p className="pb-6 text-[14px] font-medium w-full text-center">
             Increase the amount of EN you can earn per one tap. <br/>
             +1 per tap for each level.
            </p>
                  <div className="w-full flex justify-center">
                    <button
                      onClick={handleUpgrade}
                      disabled={!hasSufficientBalance}
                      className={`${!hasSufficientBalance ? 'bg-[#0000004a] text-[#888]' : 'bg-btn4 text-[#000]'} ${isDisabled === true ? 'pointer-events-none' : 'pointer-events-auto'} w-full py-[14px] px-6 flex items-center justify-center text-center rounded-[12px] font-semibold text-[16px]`}
                    >
                      {isUpgrading ? 'Boosting...' : hasSufficientBalance ? 'Boost' : 'Insufficient Balance'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
               {/* Energy Upgrade Modal */}
               <div
              className={`${
                isUpgradeModalVisibleEn ? "visible" : "invisible"
              } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
            >
              <div className={`${
                isUpgradeModalVisibleEn ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
              } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
                <div className="w-full flex justify-center flex-col items-center space-y-3">
                <button
                      onClick={() =>  setIsUpgradeModalVisibleEn(false)}
                      className="flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]"
                    >
                     <IoClose size={24} className="text-[#9a96a6]"/>
                    </button>
                  <div className="w-full items-center justify-center flex flex-col pt-[20px]">
                    <MdBatteryCharging90 size={55} className='text-accent'/>

                  </div>
                  <h3 className="font-medium text-[22px] pt-2 !mt-[2px]">
             Energy Limit level <span className='text-accent'>{energyValues[battery.level]?.level}</span>
            </h3>
            <span className="flex items-center space-x-1 !mt-[4px]">
                  <span className="flex items-center"> <img alt="daxy" src='https://ucarecdn.com/8b43a50a-7638-4cde-9a70-b2a1d612c98b/engagesmall.webp' className='w-[18px]' /></span>
                 <span className='font-semibold text-[17px]'>{formatNumber(nextEnergyUpgradeCost)}</span>
                 </span> 

                  <p className="pb-6 text-[14px] font-medium w-full text-center">
             Increase the limit of your energy storage. <br/>
             +500 energy limit for each level.
            </p>
                  <div className="w-full flex justify-center">
                    <button
                      onClick={handleEnergyUpgrade}
                      disabled={!hasSufficientBalanceEn}
                      className={`${!hasSufficientBalanceEn ? 'bg-[#0000004a] text-[#888]' : 'bg-btn4 text-[#000]'} ${isDisabled ? 'pointer-events-none' : 'pointer-events-auto'} w-full py-[14px] px-6 flex items-center justify-center text-center rounded-[12px] font-semibold text-[16px]`}
                    >
                      {isUpgradingEn ? 'Boosting...' : hasSufficientBalanceEn ? 'Boost' : 'Insufficient Balance'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

 
            <div 
        className={`${
          openInfo=== true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
  

    <div ref={infoRef} className={`${
          openInfo === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
              <PiRocketLaunchFill size={32} className='text-accent'/>
              <p className='font-medium'>x2 balance</p>
            </div>
            <h3 className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2 uppercase">
            Balance boost card
            </h3>
            <p className="pb-6 text-[#bfbfbf] text-[15px] w-full text-center">
            This booster card allows you to get double of your earnings before listing date. Ancipate and keep claiming your tokens as you await airdrop date.
            </p>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={() => setOpenInfo(false)}
              className="bg-btn4 w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
             Back to boosters
            </button>
          </div>
        </div>
      </div>


   <Levels showLevel={showLevel} setShowLevel={setShowLevel} />
{currentLevel && (
  <>
  </>
)}

</div>
          <Outlet />
        </Animate>
     
    </>
  );
};

export default Boost;
