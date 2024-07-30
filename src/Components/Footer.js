import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { PiUsersThreeFill } from "react-icons/pi";
import { PiNotebookFill } from "react-icons/pi";
import { PiHandTapFill } from "react-icons/pi";
import { PiRocketLaunchFill } from "react-icons/pi";
// import { IoWalletSharp } from "react-icons/io5";
import { useUser } from "../context/userContext";




const Footer = () => {
  const location = useLocation();
  const {selectedExchange} = useUser();


const footerLinks = [
  {
      title: "Frens",
      link: "/ref",
      icon: <PiUsersThreeFill size={22} className={location.pathname === "/mongo" ? "w-[26px] h-[26px]" : ""}/>
  },
  {
      title: "Tasks",
      link: "/tasks",
      icon: <PiNotebookFill size={20} className={location.pathname === "/tasks" ? "w-[26px] h-[26px]" : ""} />
  },
  {
      title: "Earn",
      link: "/",
      icon: selectedExchange.id === 'selectex' ? (<><PiHandTapFill size={20} className={location.pathname === "/" ? "w-[26px] h-[26px]" : ""} /></>) : (<><img id={selectedExchange.id} src={selectedExchange.icon} alt="selected" className="w-[26px]"/></>)
  },
  {
      title: "Boost",
      link: "/boost",
      icon: <PiRocketLaunchFill size={20} className={location.pathname === "/boost" ? "w-[26px] h-[26px]" : ""} />
  },
  {
      title: "Airdrop",
      link: "/wallet",
      icon: <img src='/airdrop.webp' alt="wallet" className={location.pathname === "/wallet" ? "w-[22px] h-[22px]" : "w-[18px] h-[18px] grayscale"}/>
  },
]
  return (
    <div className="w-full z-30 flex items-center px-[8px] h-[72px] pbd-[2px] justify-center space-x-2 bg-[#212121] border-[#363636] pb-[3px] border-[1px] border-b-[#2c2b2b] rounded-[35px]">

      {footerLinks.map((footer, index) => (
      <NavLink 
      id="reels"
      key={index}
      to={footer.link}
      className={({ isActive }) => {
        return `

${
isActive
  ? "w-[20%] py-3 flex flex-col h-[60px] px-[6px] mt-1 rounded-[10px] bg-cards items-center justify-center text-[#fff] text-[13px] first:rounded-tl-[22px] first:rounded-bl-[22px] last:rounded-tr-[22px] last:rounded-br-[22px]"
  : "w-[20%] py-3 flex flex-col space-y-[2px] rounded-[10px] items-center justify-center text-[#c6c6c6] text-[13px]"
}
  `;
      }}
    >
              <div id="reels2" className={location.pathname === `${footer.link}` ? 
  "space-y-[2px] flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[12px]"
  : "flex flex-col space-y-[4px] rounded-[10px] items-center justify-center text-[#949494] text-[12px]"}>
                {footer.icon}
           
        <span className={`${location.pathname === `${footer.link}` ? "text-[#fff]" : "text-[#949494]"} font-medium mb-[-2px]`}>{footer.title}</span>
        </div>
        </NavLink>
      ))}
    
    </div>
  );
};

export default Footer;
