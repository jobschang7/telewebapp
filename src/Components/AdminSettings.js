import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import { db } from '../firebase/firestore';
import { IoCloseCircleSharp } from 'react-icons/io5';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    coolDownTime: 0,
    tappingGuru: 0
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const docRef = doc(db, "settings", "1q01CYx0LFmgLR4wiUxX"); // Replace with your actual document ID
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setSettings(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value === '' ? '' : Number(value) });
  };

  const handleUpdateSettings = async () => {
    const docRef = doc(db, "settings", "1q01CYx0LFmgLR4wiUxX"); // Replace with your actual document ID
    try {
      await updateDoc(docRef, settings);
      fetchSettings();
      setShowSuccessModal(true); // Show success modal
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };
  const closeModal = () => {
    setShowSuccessModal(false);
  };


  return (
    <div id='refer' className="w-full flex flex-col space-y-4 h-[100vh] scroller pt-4 overflow-y-auto pb-[150px]">

      <h1 className="text-[20px] font-semibold mb-1">Set Default Values</h1>


            <div className="flex w-full flex-wrap gap-3">
            <div className='flex flex-col w-full sm:w-[49%] gap-1'>

                <label className='text-[13px] pl-1 pb-[2px] font-medium'>
Cool down Time
                </label>
        <input
          type="number"
          name="coolDownTime"
          value={settings.coolDownTime}
          onChange={handleInputChange}
          placeholder="Cool Down Time"
          className="bg-[#4b4b4b] placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
          />
          </div>

          <div className='flex flex-col w-full sm:w-[49%] gap-1'>

<label className='text-[13px] pl-1 pb-[2px] font-medium'>
Tap Guru Boost Value
</label>
        <input
          type="number"
          name="tappingGuru"
          value={settings.tappingGuru}
          onChange={handleInputChange}
          placeholder="Tapping Guru"
          className="bg-[#4b4b4b] placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
          />
          </div>

        <button onClick={handleUpdateSettings} className="bg-green-500 font-semibold text-[15px] rounded-[6px] w-[50%] sm:w-[200px] h-fit px-4 py-3 text-[#fff]">Update Settings</button>
      </div>


       {/* Success Modal */}

{showSuccessModal  && (
        <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
          <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
          <div className="modal-container bg-[#595D65] w-11/12 md:max-w-md mx-auto rounded-[10px] shadow-lg z-50 overflow-y-auto">
            <div className="modal-content py-4 text-left px-6">
              <div className="flex justify-end items-center pb-3">
                <div className="modal-close cursor-pointer z-50" onClick={closeModal}>
                <IoCloseCircleSharp size={32} className='text-secondary' />
                </div>
              </div>
              <div className="flex justify-center items-center">
                <p>Settings have been updated successfully.</p>
              </div>
              <div className="flex justify-center pt-2">
                <button className="modal-close bg-blue-500 text-white p-2 px-6 rounded" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminSettings;
