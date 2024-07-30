import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firestore'; // adjust the path as needed
import { collection, getDocs, query } from "firebase/firestore"; 
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { PiArrowRight } from 'react-icons/pi';
import Spinner from './Spinner';



const linksTo = [
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
        title: 'Search user',
    },
    {
        link: '/dashboardAdx/settings',
        title: 'Settings',
    },
] 


const StatisticsPanel = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalTapBalance, setTotalTapBalance] = useState(0);
  const [activeUsersLast24Hours, setActiveUsersLast24Hours] = useState(0);
  const [activeUsersLast1Hour, setActiveUsersLast1Hour] = useState(0);
  const [activeUsersLast1Minute, setActiveUsersLast1Minute] = useState(0); // New state for last 1 minute
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);


  const fetchStatistics = async () => {
    // const now = moment();
    const last24Hours = moment().subtract(24, 'hours').toDate();
    const last1Hour = moment().subtract(1, 'hour').toDate();
    const last1Minute = moment().subtract(1, 'minute').toDate(); // New time range for last 1 minute

    console.log('Last 24 Hours:', last24Hours);
    console.log('Last 1 Hour:', last1Hour);

    const usersQuery = query(collection(db, "telegramUsers"));
    const querySnapshot = await getDocs(usersQuery);
    const usersData = querySnapshot.docs.map(doc => doc.data());

    // Total number of users
    const totalUsersCount = usersData.length;
    setTotalUsers(totalUsersCount);
    setLoading(false);

    // Total balance and total tap balance
    const totalBalanceSum = usersData.reduce((acc, user) => acc + (user.balance || 0), 0);
    const totalTapBalanceSum = usersData.reduce((acc, user) => acc + (user.tapBalance || 0), 0);

    setTotalBalance(totalBalanceSum);
    setTotalTapBalance(totalTapBalanceSum);

    // Active users in the last 24 hours and last 1 hour
    const activeUsers24Hours = usersData.filter(user => user.lastActive && user.lastActive.toDate() > last24Hours).length;
    const activeUsers1Hour = usersData.filter(user => user.lastActive && user.lastActive.toDate() > last1Hour).length;
    const activeUsers1Minute = usersData.filter(user => user.lastActive && user.lastActive.toDate() > last1Minute).length; // New filter for last 1 minute

    setActiveUsersLast24Hours(activeUsers24Hours);
    setActiveUsersLast1Hour(activeUsers1Hour);
    setActiveUsersLast1Minute(activeUsers1Minute); // Set state for last 1 minute
  };




  const formatNumber = (num) => {
    if (typeof num !== "number") {
      return "Invalid number";
    }
    
    // If the number is less than 1 and has more than 3 decimal places
    if (num < 1 && num.toString().split('.')[1]?.length > 3) {
      return num.toFixed(6).replace(/0+$/, ''); // Trims trailing zeroes
    }
    
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };


  const statista = [
    {
        title: 'Total Users',
        count: totalUsers,
    },
    {
        title: 'Total Balance',
        count: (formatNumber(totalBalance)),
    },
    {
        title: 'Total Taps',
        count: (formatNumber(totalTapBalance)),
    },
    {
        title: 'Last 24hours',
        count: activeUsersLast24Hours,
    },
    {
        title: 'Last 1hour',
        count: activeUsersLast1Hour,
    },
    {
      title: 'Online Users',
      count: activeUsersLast1Minute, // New entry for last 1 minute
    },
  ]





  return (
    <>
        {loading ? (
       
       <Spinner/>
      
   ) : (
    <div className="w-full flex flex-col space-y-4 h-[100vh] scroller pt-4 overflow-y-auto pb-[150px]">
    <div className="w-full flex justify-start items-start flex-wrap gap-4">
     
     {statista.map((stats, index) => (
              <div key={index} className={`bg-cards p-4 rounded-[10px] w-[47%] sm:w-[32%] h-[120px] flex flex-col justify-center space-y-3 ${statista.length === 5 ? 'last:w-full sm:last:w-[64%]' : '' }`}>
              <h2 className="text-[16px] sm:text-[18px] font-semibold text-[#bdbdbd]">
                {stats.title}
                </h2>
              <span className='text-[20px] sm:text-[24px] text-[#fff] font-bold'>
                {stats.count}
                
                </span>
            </div>
     ))}

    </div>
    <h2 className='font-semibold text-[17px] pt-3'>
        Admin Control Items
    </h2>

    <div className='flex flex-col space-y-4 w-full'>

{linksTo.map((menu, index) => (
    <NavLink to={menu.link} key={index} className={`bg-cards px-4 py-4 flex rounded-[6px] justify-between items-center space-x-1 font-medium`}>

       <span className=''>
         {menu.title}
         </span>
         <span className=''>
    <PiArrowRight size={16} className=''/>
</span>
    </NavLink>
))}
    </div>
    </div>
  )}
    </>
  );
};

export default StatisticsPanel;
