import React, { useState, useEffect, useRef  } from 'react'
import LogoutButton from '../Components/LogoutButton'
import { useAuthContext } from '../context/AuthContext';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../Components/Spinner';
// import { AdminProvider } from '../context/AdminContext';
// import { useAdmin } from '../context/AdminContext';
import { Outlet } from "react-router-dom";
import { IoCloseCircle } from 'react-icons/io5';
import { HiMenuAlt1 } from "react-icons/hi";


const linksTo = [
    {
        link: '/dashboardAdx/stats',
        title: 'Dashboard',
    },
    {
        link: '/dashboardAdx/managetasks',
        title: 'Telegram Tasks',
    },
    {
        link: '/dashboardAdx/externaltasks',
        title: 'External Tasks',
    },
    {
        link: '/dashboardAdx/search',
        title: 'Users list',
    },
    {
        link: '/dashboardAdx/settings',
        title: 'Settings',
    },
] 


const Dashboard = () => {
    const { user, loading } = useAuthContext();
    const [showMenu, setShowMenu] = useState(false);
    const pageRoute = useLocation();
    const [pageTitle, setPageTitle] = useState('')

    const infoRefTwo = useRef(null);
    // const {} = useAdmin();

    const location = useNavigate()
    const handleClickOutside = (event) => {

        if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
          setShowMenu(false);
        }
      };



useEffect(() => {
    if (pageRoute.pathname === '/dashboardAdx/stats') {
        setPageTitle('Admin Dashboard')
    } else if (pageRoute.pathname === '/dashboardAdx/managetasks') {
        setPageTitle('Manage Telegram Tasks')
    } else if (pageRoute.pathname === '/dashboardAdx/externaltasks') {
        setPageTitle('Manage External Tasks')
    }  else if (pageRoute.pathname === '/dashboardAdx/settings') {
        setPageTitle('Settings')
    }  else {
        setPageTitle('Users list')
        
    }
}, [pageRoute.pathname])

    useEffect(() => {
        if (!loading && !user) {
          location("/dashboardadmin36024x");
        }
      }, [user, loading, location]);
          
      useEffect(() => {
        if (showMenu) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [showMenu]);
    
      if (loading) {
        return <Spinner/>;
      }
    
      if (!user) {
        return null;
      }
  

    



      
  return (

     
  
        <div className="w-full flex justify-center">
          <div className="flex flex-col pt-5 space-y-3 w-full">

       
       


            <div className='w-full flex justify-center flex-col -mt-5'>

<div className='w-full flex justify-between gap-2 items-center bg-[#3e3e3e] p-4 fixed top-0 left-0 right-0'>

    <div className='flex sm:w-[18%] items-center'>
<NavLink to='/dashboardAdx/stats' className=''>
<img src='/loader.webp' alt='not' className='w-[30px]'/>
</NavLink>


    </div>

    <div className='sm:w-[82%] flex flex-1 justify-between items-center sm:px-4'>
    <h1 className='text-[16px] sm:text-[18px] font-bold text-nowrap'>
        {pageTitle}
    </h1>
    

    <div className='relative flex justify-end w-[60%]'>
        
        {showMenu ? (
    <button onClick={() => setShowMenu(false)}
    className='h-[35px] w-[35px] rounded-full bg-[#606060] flex items-center justify-center text-[#fff]'>
        <IoCloseCircle size={18} className=''/>
    </button>
        ) : (
            <button onClick={() => setShowMenu(true)}
            className='h-[35px] w-[35px] rounded-full bg-[#606060] flex items-center justify-center text-[#fff]'>
                <HiMenuAlt1 size={18} className=''/>
            </button>
        )}

    {/* <div ref={infoRefTwo} className={`${showMenu === true ? 'flex' : 'hidden'} flex-col space-y-2 w-[250px] right-0 top-12 rounded-[8px] absolute bg-[#323232] p-4`}>


  <div className='flex flex-col space-y-2 relative'>
  <span className='text-[15px] text-wrap line-clamp-1'>
   {user && (user.email)}
    </span>
    <LogoutButton/>
  </div>


    </div> */}
    </div>
    </div>


</div>
<div className='w-full flex justify-between'>
<div className={`${showMenu === true ? 'visible opacity-100 pointer-events-auto left-0 right-0 bottom-0' : 'invisible opacity-0 sm:opacity-100 sm:visible pointer-events-none sm:pointer-events-auto left-[-100%] sm:left-0'} backdrop-blur-[1px] w-full ease-in duration-200 bg-[#2424243f] z-20 sm:w-[18%] flex flex-col top-0 fixed sm:relative`}>


    <div ref={infoRefTwo} className={`w-[70%] sm:w-full bg-[#282828] h-screen absolute left-0 top-0 flex flex-col space-y-5 p-4`}>

    <div className='flex items-center flex-row sm:flex-col w-full gap-2'>

        <img src='/loader.webp' alt='not' className='w-[28px] sm:w-[35px]'/>
        <span className='text-[13px]'>
        {user && (user.email)}
        </span>

    </div>

    <div className='flex flex-col space-y-3 w-full pt-8'>

        {linksTo.map((menu, index) => (
            <NavLink to={menu.link} onClick={() => setShowMenu(false)} key={index} className={`${pageRoute.pathname === `${menu.link}` ? 'bg-[#424242]' : ''} px-2 py-3 flex rounded-[6px] items-center space-x-1 font-medium`}>
                <span className=''>

                </span>
               <span className=''>
                 {menu.title}
                 </span>
            </NavLink>
        ))}

<LogoutButton/>

    </div>
    </div>
    </div>

<div className='w-full sm:w-[82%] flex px-4 sm:px-6 flex-col pt-[70px]'>


<Outlet />

</div>

</div>








           
         
       </div>
           </div>
           </div>







  )
}

export default Dashboard