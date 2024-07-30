import React, { useEffect, useState } from 'react';
import { useUser } from '../context/userContext';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

const userLevels = [
  { name: 'Bronze', icon: '/bronze.webp', tapBalanceRequired: 1000 },
  { name: 'Silver', icon: '/silver.webp', tapBalanceRequired: 50000 },
  { name: 'Gold', icon: '/gold.webp', tapBalanceRequired: 500000 },
  { name: 'Platinum', icon: '/platinum.webp', tapBalanceRequired: 1000000 },
  { name: 'Diamond', icon: '/diamond.webp', tapBalanceRequired: 2500000 },
  { name: 'Master', icon: '/master.webp', tapBalanceRequired: 5000000 },
];

const Levels = ({showLevel, setShowLevel}) => {
  const { tapBalance } = useUser();
  const initialLevelIndex = userLevels.findIndex(level => tapBalance < level.tapBalanceRequired);
  const currentLevelIndex = initialLevelIndex === -1 ? userLevels.length - 1 : initialLevelIndex;

  const [displayedLevelIndex, setDisplayedLevelIndex] = useState(currentLevelIndex);

  const handlePrevious = () => {
    if (displayedLevelIndex > 0) {
      setDisplayedLevelIndex(displayedLevelIndex - 1);
    }
  };

  const handleNext = () => {
    if (displayedLevelIndex < userLevels.length - 1) {
      setDisplayedLevelIndex(displayedLevelIndex + 1);
    }
  };

  const currentLevel = userLevels[displayedLevelIndex];

  const formatNumberCliam = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 10000000) {
        return new Intl.NumberFormat().format(num).replace(/,/g, " ");
      } else {
      return (num / 10000000).toFixed(3).replace(".", ".") + " T";
    }
  };
  useEffect(() => {

    // Attach a click event listener to handle the back navigation
    const handleBackButtonClick = () => {
      setShowLevel(false);
    };

      
    if (showLevel) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
    } else {
      window.Telegram.WebApp.BackButton.hide();
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    }
  
    // Cleanup handler when component unmounts
    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);

    };
  }, [showLevel, setShowLevel]);

  return (
    <>
    {showLevel && (
      
    <div className="fixed left-0 right-0 z-20 top-[-12px] bottom-0 flex justify-center taskbg px-[16px] h-full">

    <div className="w-full pt-10 justify-center flex-col space-y-6">

      <div className="flex items-center space-x-4">

        <div className="flex flex-col items-center">
        <h1 className="text-[22px] font-semibold">{currentLevel.name}</h1>
        <p className='text-[15px] text-[#c6c6c6] leading-[24px] w-full text-center px-3 pt-2 pb-[42px]'>
                                Your number of shares determines the league you enter:
                            </p>
                            <div className='w-full relative flex items-center justify-center'>
                            <div className="absolute left-[5px]">
          {displayedLevelIndex > 0 && (
            <button className="text-[#b0b0b0] hover:text-[#c4c4c4]" onClick={handlePrevious}>
             <MdOutlineKeyboardArrowLeft size={40} className='' />
            </button>
          )}
        </div>

          <img src={currentLevel.icon} alt={currentLevel.name} className="w-[200px] h-auto" />

          <div className="absolute right-[5px]">
          {displayedLevelIndex < userLevels.length - 1 && (
            <button className="text-[#b0b0b0] hover:text-[#c4c4c4]" onClick={handleNext}>
                <MdOutlineKeyboardArrowRight size={40} className='' />
            </button>
          )}
        </div>

                            </div>
     
          {displayedLevelIndex === currentLevelIndex && displayedLevelIndex < userLevels.length - 1 ? (
            <>
               <p className="text-[18px] font-semibold text-[#c6c6c6] px-[20px] pt-[35px] pb-[10px]">{tapBalance} / {formatNumberCliam(currentLevel.tapBalanceRequired)}</p>
            
            
               <div className='w-full px-[44px]'>
            <div className='flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders2'>
       

        <div className={`h-[8px] rounded-[8px] levelbar`} style={{ width: `${(tapBalance / currentLevel.tapBalanceRequired) * 100}%` }}/> 
        </div>

   </div>



            </>
          ) : (
            <>
        <p className="text-[16px] font-medium text-[#c6c6c6] px-[20px] pt-[35px] pb-[10px]">From {formatNumberCliam(currentLevel.tapBalanceRequired)}</p>

            </>
          )}
        </div>

      </div>
    </div>

    </div>

)}
    </>
  );
};

export default Levels;
