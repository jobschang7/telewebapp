import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/firestore'; // Adjust the path as needed
import { useLocation } from 'react-router-dom';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [tapBalance, setTapBalance] = useState(0);
  const [level, setLevel] = useState({ id: 1, name: "Bronze", imgUrl: "/bronze.webp" });
  const [tapValue, setTapValue] = useState({level: 1, value: 1});
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [energy, setEnergy] = useState(0);
  const [battery, setBattery] = useState({level: 1, energy: 500});
  const [initialized, setInitialized] = useState(false);
  const [refBonus, setRefBonus] = useState(0);
  const [manualTasks, setManualTasks] = useState([]);
  const [userManualTasks, setUserManualTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [claimedMilestones, setClaimedMilestones] = useState([]);
  const [claimedReferralRewards, setClaimedReferralRewards] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState({id: 'selectex', icon: '/exchange.svg', name: 'Select exchange'});
  const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
  const [tapGuru, setTapGuru] = useState(false);
  const [mainTap, setMainTap] = useState(true);
  const [freeGuru, setFreeGuru] = useState(3);
  const [time, setTime] = useState(22);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lastTime, setLastTime] = useState(null);
  const [claimExchangePoint, setClaimExchangePoint] = useState(true)
  const [selectedCharacter, setSelectedCharacter] = useState({name: '', avatar: ''});
  const [characterMenu, setCharacterMenu] = useState(false)
  const [fullName, setFullName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isAddressSaved, setIsAddressSaved] = useState(false); // State to track if address is saved
  const [coolDownTime, setCoolDownTime] = useState(0);
  const [tappingGuru, setTappingGuru] = useState(0);
  const location = useLocation();
  const [openInfoTwo, setOpenInfoTwo] = useState(true);


  useEffect(() => {
    let timerId;
    if (isTimerRunning && time > 0) {
      timerId = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setTapGuru(false);
      setMainTap(true);
    }
    return () => clearInterval(timerId);
  }, [isTimerRunning, time]);

  const startTimer = useCallback(() => {
    setTime(22);
    setTapGuru(true);
    setIsTimerRunning(true);
  }, []);




  

  const fetchData = async (userId) => {
    if (!userId) return;
    try {
      const userRef = doc(db, 'telegramUsers', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setBalance(userData.balance);
        setTapBalance(userData.tapBalance);
        setTapValue(userData.tapValue);
        setClaimedMilestones(userData.claimedMilestones || []);
        setClaimedReferralRewards(userData.claimedReferralRewards || []);
        setSelectedExchange(userData.selectedExchange);
        setSelectedCharacter(userData.character)
        setFreeGuru(userData.freeGuru);
        setWalletAddress(userData.address)
        setIsAddressSaved(userData.isAddressSaved)
        setEnergy(userData.energy);
        setFullName(userData.fullName)
        setBattery(userData.battery);
        setLevel(userData.level);
        setId(userData.userId);
        setRefBonus(userData.refBonus || 0);
        setCompletedTasks(userData.tasksCompleted || []);
        setUserManualTasks(userData.manualTasks || []);
        setReferrals(userData.referrals || []);
        await updateActiveTime(userData.lastActive)

      }

      const tasksQuerySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = tasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);

      const manualTasksQuerySnapshot = await getDocs(collection(db, 'manualTasks'));
      const manualTasksData = manualTasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setManualTasks(manualTasksData);


    // Fetch settings data
    const settingsDocRef = doc(db, 'settings', '1q01CYx0LFmgLR4wiUxX'); // Replace with your actual document ID
    const settingsDocSnap = await getDoc(settingsDocRef);

    if (settingsDocSnap.exists()) {
      const settingsData = settingsDocSnap.data();
      setCoolDownTime(settingsData.coolDownTime);
      setTappingGuru(settingsData.tappingGuru);
    }

    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setLoading(false);
  };

  const sendUserData = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    let referrerId = queryParams.get("ref");
    if (referrerId) {
      referrerId = referrerId.replace(/\D/g, "");
    }

    if (telegramUser) {
      const { id: userId, username, first_name: firstName, last_name: lastName } = telegramUser;
      const finalUsername = username || `${firstName}_${userId}`;
      const fullNamed = `${firstName} ${lastName}`

      try {
        const userRef = doc(db, 'telegramUsers', userId.toString());
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          fetchData(userId.toString());
          await updateEnergy(userRef, userDoc.data().battery.energy);
          await updateReferrals(userRef);
          setInitialized(true);
          return;
        }

        const userData = {
          userId: userId.toString(),
          username: finalUsername,
          firstName: firstName,
          lastName: lastName,
          fullName: fullNamed,
          totalBalance: 0,
          balance: 0,
          tapBalance: 0,
          lastActive: new Date(),
          character: {name: '', avatar: '/user.webp'},
          freeGuru: 3,
          tapValue: {level: 1, value: 1},
          level: { id: 1, name: "Bronze", imgUrl: "/bronze.webp" },
          selectedExchange: {id: 'selectex', icon: '/exchange.svg', name: 'Choose exchange'},
          energy: 500,
          battery: {level: 1, energy: 500},
          refereeId: referrerId || null,
          referrals: []
        };

        await setDoc(userRef, userData);
        setEnergy(500);
        setFreeGuru(userData.freeGuru);
        setSelectedCharacter(userData.character)
        setFullName(fullNamed)
        setCharacterMenu(true);
        setSelectedExchange({id: 'selectex', name: 'Choose exchange', icon: '/exchange.svg'});
        setId(userId.toString());

        if (referrerId) {
          const referrerRef = doc(db, 'telegramUsers', referrerId);
          const referrerDoc = await getDoc(referrerRef);
          if (referrerDoc.exists()) {
            await updateDoc(referrerRef, {
              referrals: arrayUnion({
                userId: userId.toString(),
                username: finalUsername,
                balance: 0,
                level: { id: 1, name: "Bronze", imgUrl: "/bronze.webp" },
              })
            });
          }
        }
        setInitialized(true);
        fetchData(userId.toString());
      } catch (error) {
        console.error('Error saving user in Firestore:', error);
      }
    }
  };

  const updateEnergy = async (userRef, batteryValue) => {
    const savedEndTime = localStorage.getItem('endTime');
    const savedEnergy = localStorage.getItem('energy');
    const endTime = new Date(savedEndTime);
    const newTimeLeft = endTime - new Date();
    if (newTimeLeft < 0 && savedEnergy <= 0) {
      try {
        await updateDoc(userRef, { energy: batteryValue });
        setEnergy(batteryValue);
      } catch (error) {
        console.error('Error updating energy:', error);
      }
    }
  };

  const updateActiveTime = async (userRef) => {

    try {
      await updateDoc(userRef, { 
        lastActive: new Date(),
      });
      console.log('Active Time Updated');
    } catch (error) {
      console.error('Error updating Active Time:', error);
    }
  }

  const updateReferrals = async (userRef) => {
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const referrals = userData.referrals || [];

    const updatedReferrals = await Promise.all(referrals.map(async (referral) => {
      const referralRef = doc(db, 'telegramUsers', referral.userId);
      const referralDoc = await getDoc(referralRef);
      if (referralDoc.exists()) {
        const referralData = referralDoc.data();
        return {
          ...referral,
          balance: referralData.balance,
          level: referralData.level,
        };
      }
      return referral;
    }));

    await updateDoc(userRef, { referrals: updatedReferrals });

    const totalEarnings = updatedReferrals.reduce((acc, curr) => acc + curr.balance, 0);
    const refBonus = Math.floor(totalEarnings * 0.1);
    const totalBalance = `${balance}` + refBonus;
    try {
      await updateDoc(userRef, { refBonus, totalBalance, lastActive: new Date() });
    } catch (error) {
      console.error('Error updating referrer bonus:', error);
    }
  };

  const updateUserLevel = async (userId, newTapBalance) => {
    let newLevel = { id: 1, name: "Bronze", imgUrl: "/bronze.webp" };

    if (newTapBalance >= 1000 && newTapBalance < 50000) {
      newLevel = { id: 2, name: "Silver", imgUrl: "/silver.webp" };
    } else if (newTapBalance >= 50000 && newTapBalance < 500000) {
      newLevel = { id: 3, name: "Gold", imgUrl: "/gold.webp" };
    } else if (newTapBalance >= 500000 && newTapBalance < 1000000) {
      newLevel = { id: 4, name: "Platinum", imgUrl: "/platinum.webp" };
    } else if (newTapBalance >= 1000000 && newTapBalance < 2500000) {
      newLevel = { id: 5, name: "Diamond", imgUrl: "/diamond.webp" };
    } else if (newTapBalance >= 2500000) {
      newLevel = { id: 6, name: "Master", imgUrl: "/master.webp" };
    }

    if (newLevel.id !== level.id) {
      setLevel(newLevel);
      const userRef = doc(db, 'telegramUsers', userId);
      await updateDoc(userRef, { level: newLevel });
    }
  };



  const checkAndUpdateFreeGuru = async () => {
    const userRef = doc(db, 'telegramUsers', id.toString());
    const userDoc = await getDoc(userRef);
  
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const lastDate = userData.timeSta.toDate(); // Convert Firestore timestamp to JS Date
      const formattedDates = lastDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
      const currentDate = new Date(); // Get the current date
      const formattedCurrentDates = currentDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
      // const timeDifference = (currentTime - lastTimeSta) / 1000; // Time difference in seconds
      // console.log('timesta is:', lastDate)
      // console.log('current time is:', currentDate)
      // console.log('time difference is:', timeDifference)
  
      if (formattedDates !== formattedCurrentDates && userData.freeGuru <= 0) {
        await updateDoc(userRef, {
          freeGuru: 3,
          timeSta: new Date()

        });
        setFreeGuru(3);
      }
    }
  };


  useEffect(() => {
    const rewards = document.getElementById('reels');
    const rewardsTwo = document.getElementById('reels2');

    if (location.pathname === '/rewards') {
      rewards.style.background = "#a4a4a433";
      rewards.style.color = "#fff";
      rewardsTwo.style.color = "#fff";
      rewards.style.height = "60px";
      rewards.style.marginTop = "4px";
      rewards.style.paddingLeft = "6px";
      rewards.style.paddingRight = "6px";
      rewards.style.borderBottomLeftRadius = "22px";
      rewards.style.borderTopLeftRadius = "22px";
    } else {
      rewards.style.background = "";
      rewards.style.color = "";
      rewards.style.height = "";
      rewards.style.marginTop = "";
      rewardsTwo.style.color = "";
      rewards.style.paddingLeft = "";
      rewards.style.paddingRight = "";
      rewards.style.borderBottomLeftRadius = "";
      rewards.style.borderTopLeftRadius = "";
    }
  }, [location.pathname]);


  useEffect(() => {
    // Fetch the remaining clicks from Firestore when the component mounts
    const fetchRemainingClicks = async () => {
      if (id) {
        const userRef = doc(db, 'telegramUsers', id.toString());
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFreeGuru(userData.freeGuru || 0);
        }
      }
    };

    fetchRemainingClicks();
  }, [id]);

  useEffect(() => {
    if (id) {
    checkAndUpdateFreeGuru();
    }
    if (selectedCharacter.name === '') {
      setCharacterMenu(true)
    } else {
      setCharacterMenu(false);
    }
      // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    sendUserData();
    // eslint-disable-next-line 
  }, []);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
      // eslint-disable-next-line 
  }, [id]);

  useEffect(() => {
    if (id) {
      updateUserLevel(id, tapBalance);
    }
    // eslint-disable-next-line 
  }, [tapBalance, id]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <UserContext.Provider value={{ balance, fullName, openInfoTwo, setOpenInfoTwo, setFullName, coolDownTime, setCoolDownTime, tappingGuru, setTappingGuru, lastTime, walletAddress, setWalletAddress, isAddressSaved, setIsAddressSaved, selectedCharacter, setSelectedCharacter, characterMenu, setCharacterMenu, setLastTime, claimExchangePoint, setClaimExchangePoint, battery, freeGuru, setFreeGuru, isTimerRunning, setIsTimerRunning, time, setTime, startTimer, setBattery, tapGuru, setTapGuru, mainTap, setMainTap, selectedExchange, setSelectedExchange, tapValue, setTapValue, tapBalance, setTapBalance, level, energy, setEnergy, setBalance, setLevel, loading, setLoading, id, setId, sendUserData, initialized, setInitialized, refBonus, setRefBonus, manualTasks, setManualTasks, userManualTasks, setUserManualTasks, tasks, setTasks, completedTasks, setCompletedTasks, claimedMilestones, setClaimedMilestones, referrals, claimedReferralRewards, setClaimedReferralRewards }}>
      {children}
    </UserContext.Provider>
  );
};
