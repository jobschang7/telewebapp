import React, { useEffect, useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { useUser } from '../context/userContext';
import { IoCheckmarkCircleSharp } from 'react-icons/io5';
import Animate from '../Components/Animate';
import MilestoneRewards from '../Components/MilestoneRewards';
import { Outlet } from 'react-router-dom';
import { RiArrowRightSLine } from 'react-icons/ri';
import { PiUsersThreeFill } from 'react-icons/pi';
import { FaBoxes } from 'react-icons/fa';
import Levels from '../Components/Levels';


const friendsRewards = [
  { title: 'Invite 3 friends', referralsRequired: 2, bonusAward: 50000 },
  { title: 'Invite 5 friends', referralsRequired: 5, bonusAward: 150000 },
  { title: 'Invite 10 friends', referralsRequired: 10, bonusAward: 250000 },
  { title: 'Invite 25 friends', referralsRequired: 25, bonusAward: 500000 },
  { title: 'Invite 50 friends', referralsRequired: 50, bonusAward: 1000000 },
  { title: 'Invite 100 friends', referralsRequired: 100, bonusAward: 2000000 },
];

const ReferralRewards = () => {
  const { referrals, balance, setBalance, id, level, refBonus, claimedReferralRewards, setClaimedReferralRewards } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [congrats, setCongrats] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const [showLevel, setShowLevel] = useState(false);




  const handleClaim = async (reward) => {
    if (referrals.length >= reward.referralsRequired && !claimedReferralRewards.includes(reward.title)) {
      const newBalance = balance + reward.bonusAward;
      try {
        const userRef = doc(db, 'telegramUsers', id);
        await updateDoc(userRef, {
          balance: newBalance,
          claimedReferralRewards: [...claimedReferralRewards, reward.title],
        });
        setBalance(newBalance);
        setClaimedReferralRewards([...claimedReferralRewards, reward.title]);
        setModalMessage(
          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
              <IoCheckmarkCircleSharp size={32} className="text-accent" />
              <p className="font-medium text-center">Great job!</p>
            </div>
            <h3 className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2">
              <span className="text-accent">+{formatNumber(reward.bonusAward)}</span> MAX CLAIMED
            </h3>
            <p className="pb-6 text-[#bfbfbf] text-[15px] w-full text-center">
              Keep inviting friends to unlock new rewards! Amazing things await!
            </p>
          </div>
        );

        setModalOpen(true);
        setCongrats(true);

        setTimeout(() => {
          setCongrats(false);
        }, 4000);
      } catch (error) {
        console.error('Error claiming referral reward:', error);
      }
    } else {
      setModalMessage('You have already claimed this referral reward or do not meet the requirements.');
      setModalOpen(true);
    }
  };

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


  const closeModal = () => {
    setModalOpen(false);
  };

  const handleMenu = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
 
    // Show the back button when the component mounts
    window.Telegram.WebApp.BackButton.show();

    // Attach a click event listener to handle the back navigation
    const handleBackButtonClick = () => {
      window.history.back();
    };

    window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);

    // Clean up the event listener and hide the back button when the component unmounts
    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
      window.Telegram.WebApp.BackButton.hide();
    };

  }, []);


  return (
    <Animate>

<div className="w-full pt-2 justify-center flex-col space-y-6 px-5">

<div className='w-full flex justify-between'>

<button onClick={() => setShowLevel(true)} className='w-[55%] flex space-x-1 items-center'>
          <span className='flex items-center justify-center'>
              
      <img alt="engy" src={level.imgUrl} className='w-[14px] rounded-full h-full'/>

      </span>
      <span className='font-medium text-[13px] text-secondary flex items-center space-x-1'>
         <span className=''> {level.name}</span> 
          <span className='flex items-center'>  <RiArrowRightSLine size={16} className=''/> </span>
      </span>
  </button>




    <div className='w-fit py-[2px] px-3 flex items-center space-x-1 justify-center border-[1px] border-[#707070] rounded-[25px]'>
      <span className='w-[14px]'>
        <img alt="engy" src='/loader.webp' className='w-full' />
      </span>
      <h1 className="text-[15px] font-bold">
        {formatNumber(balance + refBonus)}
      </h1>
    </div>

    </div>

    <div className='w-full flex items-center justify-between'>

      <div onClick={() => handleMenu(1)} className={`${activeIndex === 1 ? 'bg-cards3 text-[#ebebeb]' : ''}  rounded-[6px] text-[#c6c6c6] py-[10px] text-nowrap barTitle px-3 w-[45%] flex space-x-2 justify-center text-center text-[15px] font-semibold items-center`}>
        <PiUsersThreeFill size={16} className="" />
        <span>Ref rewards</span>
      </div>

      <div onClick={() => handleMenu(2)} className={`${activeIndex === 2 ? 'bg-cards3 text-[#ebebeb]' : ''} barTitle rounded-[6px] text-[#c6c6c6] py-[10px] px-3 w-[45%] space-x-2 font-semibold text-[15px] flex justify-center text-center items-center`}>
        <FaBoxes size={16} className="" />  <span>
          Challenges
        </span>
      </div>

    </div>


    <div id="refer" className="w-full h-[70vh] scroller rounded-[10px] overflow-y-auto pt-2 pb-[180px]">

    <div className={`${activeIndex === 1 ? 'block' : 'hidden'} w-full flex items-end justify-center flex-col space-y-4`}>

      {friendsRewards
        .filter((reward) => !claimedReferralRewards.includes(reward.title))
        .map((reward) => {
          const progress = (referrals.length / reward.referralsRequired) * 100;
          const isClaimable = referrals.length >= reward.referralsRequired && !claimedReferralRewards.includes(reward.title);
          return (
            <div key={reward.title} className="bg-cards w-full rounded-[15px] p-[14px] flex flex-wrap justify-between items-center">
             
             
             
              <div className="flex flex-1 items-center space-x-2">
              <div className=''>
            <img src='/frens2.webp' alt="bonuses" className='w-[55px] rounded-[8px]'/>
        </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold">{reward.title}</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{formatNumber(reward.bonusAward)}</span>
                  </div>
                </div>
              </div>

              <div className="">
                <button
                  className={`w-fit relative rounded-[8px] font-semibold py-2 px-3 ${
                    isClaimable ? 'bg-btn4 text-[#000] hover:bg-[#b4b4b4] ease-in duration-200' : 'bg-[#0000004a] text-[#888] cursor-not-allowed'
                  }`}
                  disabled={!isClaimable}
                  onClick={() => handleClaim(reward)}
                >
                  {isClaimable ? 'Claim' : 'Claim'}
                </button>
              </div>

              <div className="flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders2">
                <div className={`h-[8px] rounded-[8px] ${progress >= 100 ? 'bg-[#be8130]' : 'bg-[#be8130]'}`} style={{ width: `${progress > 100 ? 100 : progress}%` }} />
              </div>
            </div>
          );
        })}

      <div className="w-full absolute top-[50px] left-0 right-0 flex justify-center z-50 pointer-events-none select-none">
        {congrats ? <img src='/congrats.gif' alt="congrats" className="w-[80%]" /> : null}
      </div>

      <div
        className={`${
          modalOpen === true ? 'visible' : 'invisible'
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
        <div
          className={`${
            modalOpen === true ? 'opacity-100 mt-0' : 'opacity-0 mt-[100px]'
          } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8 ease-in duration-300 transition-all`}
        >
          {modalMessage}
          <div className="w-full flex justify-center">
            <button
              onClick={closeModal}
              className="bg-btn4 w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
              Continue to next
            </button>
          </div>
        </div>
      </div>
    </div>


    {/*  */}


{/* challenges */}

<div className={`${activeIndex === 2 ? 'block' : 'hidden'} w-full flex items-end justify-center flex-col space-y-4`}>

<MilestoneRewards/>

</div>

<Levels showLevel={showLevel} setShowLevel={setShowLevel} />
    </div>







    </div>
    <Outlet />
      </Animate>
  );
};

export default ReferralRewards;
