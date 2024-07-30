import React from 'react';
import { isMobile } from 'react-device-detect';

const DeviceCheck = ({ children }) => {
  if (!isMobile) {
    return <div className='w-full flex h-full justify-center px-5 items-center font-medium text-[20px]'>
        
       <div className='w-full pt-24 text-center flex flex-col space-y-3 justify-center items-center'>
        <p className='text-[28px] font-semibold pb-4 max-w-[20em]'>
            Mobile rocks for gaming 😎 Open on your mobile device to play now!
        </p>
        <img src='/maxitap.webp'
        alt="plutotaps"
        className='w-[250px] rounded-[25px] border-[2px] border-btn'
        />
       </div>
        
        </div>;
  }
  return <>{children}</>;
};

export default DeviceCheck;
