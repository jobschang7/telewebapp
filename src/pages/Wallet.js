import React, { useEffect, useRef } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";

import { Address } from "../Components/WalletDetails";
import { useUser } from "../context/userContext";
import { IoClose } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";


const Wallet = () => {

  const {openInfoTwo, setOpenInfoTwo,} = useUser()
 

  const infoRefTwo = useRef(null);

  const handleClickOutside = (event) => {

    if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
      setOpenInfoTwo(false);
    }
  };

  useEffect(() => {
    if (openInfoTwo) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
       // eslint-disable-next-line
  }, [openInfoTwo]);

  return (
    <>
      {/* {loading ? (
        <Spinner />
      ) : ( */}
        <Animate>
         <div className="w-full pt-8 justify-center flex-col space-y-3 px-5">


          <div className="w-full flex justify-center items-center flex-col space-y-3">

            <img alt="daxy" src="/maxitap.webp" 
            className="w-[160px] animate-spin spinso"
            />

<div className="w-full text-center flex flex-col items-center justify-center space-y-2">


            <h1 className="font-bold text-[32px] text-center">
              Airdrop Tasks
            </h1>
            <p className='text-[14px] text-[#c6c6c6] leading-[24px] px-6 pb-8'>
            Listing soon, Complete the tasks below to participate in the Airdrop.
            </p>
<div className="w-full flex flex-col">


<Address/>

            </div>
            </div>
          </div>

          
</div>

<div 
        className={`${
          openInfoTwo=== true ? "visible" : "invisible"
        } fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-end backdrop-blur-[10px]`}
      >

<div ref={infoRefTwo} className={`w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center`}>
      

      <div className="w-full flex bg-[#202020] rounded-tl-[40px] rounded-tr-[40px] mt-[2px] h-[85vh] justify-start relative flex-col items-center space-y-3 p-4 pb-24">

              <div className="w-full flex flex-col text-center space-y-5 justify-center items-center py-8 relative">

              <div className="w-full flex flex-col justify-between py-8 px-3">
              <button
                      onClick={() =>  setOpenInfoTwo(false)}
                      className="flex items-center justify-center absolute right-6 top-6 text-center rounded-[12px] font-medium text-[16px]"
                    >
                      <IoClose size={24} className="text-[#9a96a6]"/>
                    </button>


                <div className="w-full flex justify-center flex-col items-center">
                  <div className="w-[70px] h-[70px] rounded-[15px] bg-cards3 flex items-center justify-center">
                  <IoIosWarning size={50} className="text-[#d03a2c]"/>
                  </div>
                  <h3 className="font-semibold text-[24px] py-4">
                  Hy 😎!
                  </h3>
                  <p className="pb-6 text-[#c3bfd2] text-[14px] text-center">
My name is Samuel and I developed this bot app. If you need to purchase the source code for
this project or you want to create similar projects like this, you can message me directly on telegram via <a href="https://t.me/conceptdevelopers" className="text-[#ffba4c]">t.me/conceptdevelopers</a>
                  </p>

 
                </div>

                <div className="w-full flex justify-center">
                  <button
                  onClick={()=> setOpenInfoTwo(false)}
                    className={`bg-btn4 text-[#000] w-full py-4 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[18px]`}
                  >
                  Okay, Continue 🤙
                  </button>
                </div>
              </div>


</div>

              </div>
            </div>
            </div>

          <Outlet />
        </Animate>
      {/* )} */}
    </>
  );
};

export default Wallet;
