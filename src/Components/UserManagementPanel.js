import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firestore'; // adjust the path as needed
import { collection, doc, getDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy, limit, startAfter } from "firebase/firestore";

const UserManagementPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [editUserData, setEditUserData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState({}); // Add state for dropdown visibility

  const handleSearch = async () => {
    try {
      let userFound = false;

      // Search by username
      const usernameQuery = query(
        collection(db, "telegramUsers"),
        where("username", "==", searchTerm)
      );
      const usernameSnapshot = await getDocs(usernameQuery);
      if (!usernameSnapshot.empty) {
        const userData = usernameSnapshot.docs[0].data();
        setUser({ id: usernameSnapshot.docs[0].id, ...userData });
        setEditUserData({ ...userData });
        userFound = true;
      }

      // Search by userId if not found by username
      if (!userFound) {
        const userDoc = await getDoc(doc(db, "telegramUsers", searchTerm));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({ id: userDoc.id, ...userData });
          setEditUserData({ ...userData });
          userFound = true;
        }
      }

      if (!userFound) {
        setUser(null);
        setEditUserData(null);
        setErrorMessage('No user found');
      } else {
        setErrorMessage('');
      }
    } catch (error) {
      console.error("Error searching user: ", error);
      setErrorMessage('Error searching user');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUserData({
      ...editUserData,
      [name]: name === 'balance' || name === 'tapBalance' ? Number(value) : value
    });
  };

  const handleUpdateUser = async () => {
    try {
      const userDoc = doc(db, "telegramUsers", user.id);
      await updateDoc(userDoc, editUserData);
      setSuccessMessage('User successfully updated!');
      setUser({ id: user.id, ...editUserData });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user: ", error);
      setErrorMessage('Error updating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const userDoc = doc(db, "telegramUsers", userId);
      await deleteDoc(userDoc);
      setUsers(users.filter(user => user.id !== userId));
      setSuccessMessage('User successfully deleted!');
    } catch (error) {
      console.error("Error deleting user: ", error);
      setErrorMessage('Error deleting user');
    }
  };

  const fetchUsers = async (loadMore = false) => {
    setLoading(true);
    try {
      const usersRef = collection(db, "telegramUsers");
      const usersQuery = loadMore && lastVisible
        ? query(usersRef, orderBy("balance", "desc"), startAfter(lastVisible), limit(50))
        : query(usersRef, orderBy("balance", "desc"), limit(50));

      const userSnapshot = await getDocs(usersQuery);
      const lastVisibleDoc = userSnapshot.docs[userSnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      const fetchedUsers = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsers(loadMore ? [...users, ...fetchedUsers] : fetchedUsers);
    } catch (error) {
      console.error("Error fetching users: ", error);
      setErrorMessage('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line 
  }, []);

  const toggleDropdown = (userId) => {
    setDropdownVisible(prevState => ({
      ...prevState,
      [userId]: !prevState[userId]
    }));
  };

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };


  return (
    <div className="w-full flex flex-col space-y-4 h-[100vh] scroller pt-4 overflow-y-auto pb-[150px]">
      <div className='w-full sm:w-[50%] flex flex-col gap-3'>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by username or userId"
          className="bg-[#4b4b4b] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
        />
        <button onClick={handleSearch} 
         className="bg-[#f5bb5f] font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-[#000]">          
          Search
        </button>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        {user && (
          <div className='w-full flex flex-col space-y-3 bg-cards p-4 rounded-[10px] text-[13px]'>

            {isEditing && (
                <>
                  <div className="flex w-full flex-wrap gap-3">
                    <div className='flex flex-col w-full gap-1'>
                      <label className='text-[13px] pl-1 pb-[2px] font-medium'>
                        User Balance
                      </label>
                      <input
                        type="number"
                        name="balance"
                        value={editUserData.balance}
                        onChange={handleInputChange}
                        placeholder="Balance"
                        className="bg-[#4b4b4b] placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                      />
                    </div>

                    <div className='flex flex-col w-full gap-1'>
                      <label className='text-[13px] pl-1 pb-[2px] font-medium'>
                        User tap balance
                      </label>
                      <input
                        type="number"
                        name="tapBalance"
                        value={editUserData.tapBalance}
                        onChange={handleInputChange}
                        placeholder="Tap Balance"
                        className="bg-[#4b4b4b] placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleUpdateUser} 
                    className="bg-green-500 rounded-[6px] text-white px-2 py-[12px]">
                    Update User
                  </button>
                </>
            )}

            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>User Id:</strong> {user.id}</p>
            <p><strong>User balance:</strong> {formatNumber(user.balance)}</p>
        
            <span className='flex items-center gap-1'>
              <img src={user.level.imgUrl} alt="User Level" className="w-[14px] rounded-full h-[14px]" />
              <p><strong>User level:</strong> {user.level.name}</p>
            </span>
            <p className='text-wrap break-all'><strong>walletAddress:</strong> {user.address}</p>
            <div className={`${dropdownVisible[user.id] ? 'hidden' : 'flex'} w-full items-center justify-start gap-4`}>
              <button 
                onClick={() => setIsEditing(true)} 
                className="bg-blue-500 rounded-[6px] text-white px-2 py-[6px]">
                Edit User Details
              </button>

              <button 
                onClick={handleDeleteUser} 
                className="bg-red-500 rounded-[6px] text-white px-2 py-[6px]">
                Delete User
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full sm:w-[50%] flex flex-col space-y-3">
        <h2 className="text-[20px] font-semibold">Users List</h2>
        {users.map((user, index) => (
          <div key={user.id} className="bg-[#4b4b4b] p-4 rounded-[10px] text-[13px] relative flex flex-col w-full space-y-2">
            <span className='flex w-full items-center space-x-1'>
              <span className='w-[16px] h-[16px] flex justify-center items-center rounded-full bg-cards3'>
             <strong>{index +1}</strong>
             </span> <span className='line-clamp-1 font-semibold'>{user.username} | {user.id}</span> </span>


            <span className='flex items-center gap-1 psl-1'>
              <img src='/coin.webp' alt="balance" className="w-[14px] h-[14px] rounded-full" />
              <p><span className='font-semibold text-accent'> {formatNumber(user.balance)}</span></p>
            </span>
                    
            <span className='flex items-center gap-1 pls-[1px]'>
              <img src={user.level.imgUrl} alt="User Level" className="w-[14px] rounded-full h-[14px]" />
              <p className='text-secondary'>{user.level.name} level</p>
            </span>

            <button 
              onClick={() => toggleDropdown(user.id)} 
              className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-2 h-[28px] w-[28px] flex items-center justify-center"
            >
              ⋮
            </button>

            {dropdownVisible[user.id] && (
              <div className="absolute z-10 top-8 right-2 bg-[#2e2e2e] text-primary rounded-md shadow-lg w-40">
                <button 
                  onClick={() => {
                    setUser(user);
                    setEditUserData(user);
                    setIsEditing(true);
                  }} 
                  className="block w-full text-left px-4 py-2 hover:bg-[#7a7a7a33]"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteUser(user.id)} 
                  className="block w-full text-left px-4 py-2 hover:bg-[#7a7a7a33]"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
        <button 
          onClick={() => fetchUsers(true)}
          disabled={loading}
          className="bg-[#f5bb5f] font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-[#000] mt-4"
        >
          {loading ? 'Loading...' : 'Load More Users'}
        </button>
      </div>
    </div>
  );
};

export default UserManagementPanel;
