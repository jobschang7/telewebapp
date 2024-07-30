import React, { useEffect, useState } from 'react';
import { useUser } from '../context/userContext';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import Exchanges from './Exchanges';
import { RiExchangeDollarFill } from "react-icons/ri";

const SettingsMenu = ({ showSetting, setShowSetting }) => {
  const { selectedExchange } = useUser();
  const [showExchange, setShowExchange] = useState(false);


  useEffect(() => {
    const handleBackButtonClick = () => {
      setShowSetting(false);
    };

    if (showSetting) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
    } else {
      window.Telegram.WebApp.BackButton.hide();
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    }

    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    };
  }, [showSetting, setShowSetting]);



//   const closeSetting = () => {
//     setShowSetting(false);
//   }
const openExchange = () => {
    setShowExchange(true);
    setShowSetting(false);
}



  return (
    <>
      {showSetting && (
        <div className="fixed left-0 right-0 z-20 top-[-12px] bottom-0 flex justify-center taskbg px-[16px] h-full">

          <div id="refer" className='w-full flex flex-col'>
          <div className="w-full flex pt-6 flex-col space-y-6 overflow-y-auto pb-[100px] scroller">
            <div className="flex items-center space-x-4">
              <div className='w-full'>
                <h1 className='font-semibold text-[24px] text-center pb-4'>
                  Settings
                </h1>

                <div className="w-full flex flex-col pb-[100px]">
  
                <div className='flex w-full flex-col space-y-2'>
             
                    <button 
                      onClick={openExchange}
                      className={`text-[15px] text-[#d2d2d2] bg-cards3 hover:bg-cards ease-in duration-200 h-[60px] rounded-[14px] px-4 flex justify-between items-center`}
                    >
                        <div className='flex items-center space-x-2 justify-start w-[80%]'>

                     
                      <span className=''>
                        <RiExchangeDollarFill size={20} className={``} />
                      </span>
                      <div className='flex flex-col text-left'>

                   
                      <h2 className='flex flex-1 font-medium text-[13px]'>
                      Choose exchange
                      </h2>
                      <div className='text-[12px] font-normal'>

                  
                      {selectedExchange.id === 'selectex' ? (
                        <>
                        None
                        </>
                      ) : (
                        <>
                        {selectedExchange.name}
                        </>
                      )}
                          </div>
                         </div>
                         </div>
        
                        <MdOutlineKeyboardArrowRight size={24} className={`text-[#959595]`} />
            
                    </button>
            
                </div>

              </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
            <Exchanges showExchange={showExchange} setShowExchange={setShowExchange} />

    </>
  );
};

export default SettingsMenu;
