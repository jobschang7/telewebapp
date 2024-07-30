import React, { useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { PiSmileySadLight } from "react-icons/pi";

function ErrorCom() {
    let navigate = useNavigate();

  useEffect(() => {
    if (navigate) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
      
    };
    }, [navigate]);

    const goBack = () => {
      navigate(-1);
    };
  
  return (
    <div
      className="z-30 fixed top-0 w-full h-full bg-opacity-30 flex items-center justify-center text-center font-nunito
    "
    onClick={goBack}
    >
      <div
        className="w-[95%] ms:w-[80%] h-[98%] ss:h-[90%] ms:h-[80%] overflow-y-auto bg-[#1e2340f7] bg-opacity-85 rounded-lg text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
           {/* <div className="absolute ms:w-[700%] ms:h-[700%] md:h-[600%] md:w-[600%] ss:w-[900%] ss:h-[900%] w-[1000%] h-[1000%] mt-[-80%] ml-[-10%] ss:mt-[-35%] ss:ml-[-1%] sm:ml-[20%] sm:mt-[-25%] ms:ml-[0%] ms:mt-[-25%] rotate-[3deg] md:ml-[-20%] md:mt-[0%]"><img alt="daxy" layout="fill" src={bg003fl} className="w-[100%] ss:w-[80%] sm:w-[65%] ms:w-[80%] md:w-[50%] overflow-clip blur-[40px] sm:blur-[60px] object-contain"/></div> */}
          <div className="flex items-center justify-center flex-col ms:flex-row ms:h-full h-auto w-full p-4">


<button className="mr-2 ms:absolute ms:right-2 ms:top-4 place-self-end bg-btn2 shadow-md shadow-[#12181f] p-1 rounded-full text-black close-modal" onClick={goBack}>
 <MdOutlineClose size="28px" className="text-[#dddddd]"/>
</button>

<div className="text-center flex flex-col w-full items-center justify-center max-w-[35em] font-light font-outfit pt-8 text-[#dddddd] px-2 ms:px-0">

    <button className="bg-btn4 text-[#fff] py-2 font-medium px-5 rounded-lg w-fit hover:bg-[#3f75b2] duration-300 ease-in" onClick={goBack}>
Go back

    </button>
<p className="text-[18px] flex space-x-1 pt-7 pb-5">
   <span> Ops </span><PiSmileySadLight size="30px" className="text-[#c5d04c]"/> 

</p>
<p className="text-[18px] text-justsify">
Looks Like Something went wrong, This Telegram App is still under Development, Kindly Click On Go back </p>


</div>


</div>
</div>
</div>
  );
}

export default ErrorCom;