
import React from 'react'
import { useSelector } from 'react-redux'
import AdminSidebar from './Layout/AdminSidebar'
import AdminNav from './Layout/AdminNav'


const AdminLayout = ({children}) => {
  const {mobile} = useSelector((state)=>state.auth)
  return (
    <div className=' flex items-start bg-red-600'>
        <div className=' hidden md:block'>
            <AdminSidebar/>
        </div>
        <div className={`md:hidden absolute top-0 duration-500 ${mobile ? " left-0" : "left-[-100%]"}`}>
            <AdminSidebar/>
        </div>
        <div className=' w-full h-screen overflow-y-auto'>
            <AdminNav/>
            <div className='md:px-8 px-3 py-8'>
              {children}
            </div>
        </div>
    </div>
  )
}

export default AdminLayout