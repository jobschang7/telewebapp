import React, { useEffect, useState } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import coinsmall from "../images/coinsmall.webp";
import { db } from '../firebase/firestore';
import { collection, getDocs } from "firebase/firestore";
import Spinner from "../Components/Spinner";

const Stats = () => {
  // eslint-disable-next-line
  const [username, setUsername] = useState("");
  // eslint-disable-next-line
  const [idme, setIdme] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [dividedCount, setDividedCount] = useState(0);
  const [users, setUsers] = useState(0);
  const [dividedUsers, setDividedUsers] = useState(0);

  useEffect(() => {
    const telegramUsername =
      window.Telegram.WebApp.initDataUnsafe?.user?.username;
    const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;

    if (telegramUsername) {
      setUsername(telegramUsername);
    }
    if (telegramUserid) {
      setIdme(telegramUserid);
    }

    // Fetch total count from Firestore
    fetchTotalCountFromFirestore().then((totalCount) => {
      setTotalCount(totalCount);
      const divided = calculateDividedCount(totalCount);
      setDividedCount(divided);
    });

    fetchAllUsers(); // Fetch all users when the component mounts
  }, []);

  const fetchTotalCountFromFirestore = async () => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      let totalCount = 0;
      querySnapshot.forEach((doc) => {
        totalCount += doc.data().count;
      });
      return totalCount;
    } catch (e) {
      console.error("Error fetching documents: ", e);
      return 0;
    }
  };

  const fetchAllUsers = async () => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      const allUsers = [];
      const uniqueUsernames = new Set(); // Using a Set to store unique usernames

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const username = data.username;
        const fullname = data.fullname;
        const refereeId = data.refereeId;
        const count = data.count;

        // Check if the username is unique, if yes, add it to the allUsers array and set
        // a flag indicating that it has been added
        if (!uniqueUsernames.has(username)) {
          allUsers.push({ username, fullname, refereeId, count });
          uniqueUsernames.add(username);
        }
      });

      setUsers(allUsers.length);
      setDividedUsers(allUsers.length / 2);
      setLoading(false); // Set loading to false once data is fetched
      // Update the count of unique users
    } catch (error) {
      console.error("Error fetching users: ", error);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  const calculateDividedCount = (count) => {
    return count / 4;
  };

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ") + " K";
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  const formattedUsers = new Intl.NumberFormat()
    .format(users)
    .replace(/,/g, " ");

  const formattedDividedUsers = new Intl.NumberFormat()
    .format(dividedUsers)
    .replace(/,/g, " ");

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Animate>
          <div className="w-full justify-center flex-col space-y-3 px-5">
            <div className="fixed top-0 left-0 right-0 pt-8 px-5">
              <div className="w-full items-center justify-center pb-3 flex pt-2">
                <h2 className="text-[#9d99a9] text-[20px] font-medium">
                  Total Share balance
                </h2>
              </div>
              <div className="flex space-x-1 ml-[-8px] justify-center items-center">
                <div className="w-[50px] h-[50px]">
                  <img src={coinsmall} className="w-full" alt="coin" />
                </div>
                <h1 className="text-[#fff] text-[42px] font-extrabold">
                  {formatNumber(totalCount)}
                </h1>
              </div>

              <div className="bg-[#362c4d] w-full px-5 h-[1px] !mt-5 !mb-5"></div>

              <div className="w-full items-center flex flex-col space-y-2">
                <h3 className="text-[16px] text-[#9d99a9] items-center font-semibold pb-4 flex flex-col">
                  <span> Total Touches:</span>
                  <span className="text-[#fff] font-semibold text-[24px]">
                    {formatNumber(dividedCount)}
                  </span>
                </h3>

                {/*  */}

                <h3 className="text-[16px] text-[#9d99a9] items-center font-semibold pb-4 flex flex-col">
                  <span> Total Players:</span>
                  <span className="text-[#fff] font-semibold text-[24px]">
                    {formattedUsers}
                  </span>
                </h3>

                {/*  */}

                <h3 className="text-[16px] text-[#9d99a9] items-center font-semibold pb-4 flex flex-col">
                  <span> Daily Users:</span>
                  <span className="text-[#fff] font-semibold text-[24px]">
                    {formattedDividedUsers}
                  </span>
                </h3>

                {/*  */}

                <h3 className="text-[16px] text-[#9d99a9] items-center font-semibold pb-4 flex flex-col">
                  <span> Online Players:</span>
                  <span className="text-[#fff] font-semibold text-[24px]">
                    {formattedDividedUsers}
                  </span>
                </h3>

                {/*  */}
              </div>
            </div>
          </div>
          <Outlet />
        </Animate>
      )}
    </>
  );
};

export default Stats;
