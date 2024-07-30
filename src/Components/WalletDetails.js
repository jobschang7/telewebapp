import React, { useEffect, useRef, useState } from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { TonConnectButton } from "@tonconnect/ui-react";
import ErrorBoundary from "../Components/ErrorBoundary";
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase/firestore';
import { useUser } from '../context/userContext';

export const Address = () => {
  const {id, walletAddress, isAddressSaved, setIsAddressSaved} = useUser()
    const userFriendlyAddress = useTonAddress();
    // const rawAddress = useTonAddress(false);
    const [disconnect, setDisconnect] = useState(false);

    const [openInfoTwo, setOpenInfoTwo] = useState(false);

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
    }, [openInfoTwo]);
  
  
  //   const clearCache = () => {
  //     // Clear Local Storage
  //     localStorage.clear();
  
  //     // Clear Session Storage
  //     sessionStorage.clear();
  
  //     // Clear Service Worker Caches
  //     if ('caches' in window) {
  //       caches.keys().then(names => {
  //         names.forEach(name => {
  //           caches.delete(name);
  //         });
  //       });
  //     }
  //   };
  // const connectionRestored = useIsConnectionRestored();
  
  
const [tonConnectUI] = useTonConnectUI();

  // Function to handle disconnection
  const handleDisconnect = async () => {
    try {
      await tonConnectUI.disconnect();
      console.log('Disconnected successfully');
      setDisconnect(!disconnect)
    } catch (error) {
      console.error('Error during disconnection:', error);
    }
  };

const disco = () => {
    setDisconnect(!disconnect)
}

 // Function to save address to Firestore
 const saveAddressToFirestore = async () => {
    const userRef = doc(db, 'telegramUsers', id.toString());
      try {
        await updateDoc(userRef, {
          address: userFriendlyAddress,
          isAddressSaved: true,
        });
        setIsAddressSaved(true);
        console.log('Address saved successfully');
      } catch (error) {
        console.error('Error saving address:', error);
      }
};

// Use effect to save address whenever it changes
useEffect(() => {
  if (!isAddressSaved || walletAddress !== userFriendlyAddress) {
    saveAddressToFirestore();
  }
    // eslint-disable-next-line 
}, []);


    return (
        <>
        
        <div
 class="w-full rounded-[15px] bg-gradient-to-r from-[#457576bf] via-[#ef44ee] to-[#5c487d9e] p-[1px] flex flex-col justify-center relative">
 
 <button
   disabled={userFriendlyAddress}
        onClick={() => setOpenInfoTwo(true)} class="flex h-full w-full bg-[#319cdf] rounded-[14px] items-center py-3 px-4 relative space-x-3">

<span className="w-[11%] flex items-center mt-[-2px] ">
<img src='/wallet.webp' alt="connect"
className="w-full"/>
</span>

<div class="text-[13px] small-text2 text-left text-nowrap text-white pb-1 flex flex-col w-[73%]">
{userFriendlyAddress ? (
    <>
    <h4 className=''>Wallet Connected</h4>
<span className='line-clamp-1'>
{userFriendlyAddress}
</span>

</>
) : (
<>
<h4 className=''>Connect yout TON wallet</h4>
</>
)}
</div>
{userFriendlyAddress ? (
    <>



<IoCheckmarkCircle onClick={disco} size={28} className='text-[#25dc4f]' />

</>
) : (
<>

<MdOutlineKeyboardArrowRight size={24} className='text-[#fff]' />


</>
)}
</button>

{userFriendlyAddress && (
    <>
    <span onClick={disco} size={28} className='text-[#fff] cursor-pointer relative z-10'>
    Disconnect
    </span>

<div className={`${disconnect ? 'flex' : 'hidden'} px-4 py-2 text-[13px] text-center rounded-[8px] flex flex-col`}>

    <p className='text-[#ffffff] pb-2'>Are you sure you want to disconnect? Only connected wallets are eligible for airdrop</p>
   
   <div className='w-full flex justify-center'>
   <button onClick={handleDisconnect} className='font-medium bg-[#eb4848] w-fit rounded-[4px] px-2 py-1'>
        Disconnect wallet
    </button>
    </div>

</div>
    </>
)}

 </div>


<div 
        className={`${
          openInfoTwo=== true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
  

    <div ref={infoRefTwo} className={`${
          openInfoTwo === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>

<div className="w-fit flex justify-center absolute right-6 top-6">
            <button
              onClick={() => setOpenInfoTwo(false)}
              className="w-fit flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
            <IoCloseCircle size={32} className="text-[#8f8f8f]"/>
            </button>
          </div>


          <div className="w-full flex justify-center flex-col items-center space-y-3 pt-6">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
            <span className="w-[72px] flex items-center">
          <img src='/wallet.webp' alt="connect"
          className="w-full"/>
        </span>
              <h3 className='font-semibold text-[22px] w-full text-center'>Connect your TON wallet</h3>
              <p className="pb-6 text-[#bfbfbf] text-[14px] w-full text-center">
Connect your crypto wallet. If you don't have one, create one in your Telegram account             </p>
            </div>
            <ErrorBoundary>
          <TonConnectButton className="!w-full" />
        </ErrorBoundary>

          </div>


        </div>
      </div>
        
        </>

    );
};