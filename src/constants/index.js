
import { PiUsersThree } from "react-icons/pi";
import { PiNotebook } from "react-icons/pi";
import { PiHandTap } from "react-icons/pi";
import { PiRocketLaunch } from "react-icons/pi";
import { IoWalletOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";


export const footerLinks = [
    {
        title: "Frens",
        link: "/mongo",
        icon: <PiUsersThree size={20} className="texst-[#c6c6c6]" />
    },
    {
        title: "Tasks",
        link: "/tasks",
        icon: <PiNotebook size={20} className="texst-[#c6c6c6]" />
    },
    {
        title: "Earn",
        link: "/earn",
        icon: <PiHandTap size={20} className="tesxt-[#c6c6c6]" />
    },
    {
        title: "Boost",
        link: "/boost",
        icon: <PiRocketLaunch size={20} className="tesxt-[#c6c6c6]" />
    },
    {
        title: "Wallet",
        link: "/wallet",
        icon: <IoWalletOutline size={20} className="texst-[#c6c6c6]" />
    },
]