import React from 'react'
import AdminPanel from '../Components/AdminPanel'
import { Outlet } from "react-router-dom";

const EditTasks = () => {
  return (
    <div className=''>


    <AdminPanel/>
    <Outlet/>
    </div>
  )
}

export default EditTasks