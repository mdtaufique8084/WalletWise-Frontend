import React, { useContext } from 'react'
import MenuBar from './MenuBar'
import { AppContext } from "../context/AppContext";
import SideBar from './SideBar';

const Dashboard = ({children}) => {
  const { user } = useContext(AppContext);
  return (
    <>
      <MenuBar />
      {user && (
        <div className='flex'>
          <div className='max-[1080px]:hidden'>
            {/* Side Bar content */}
            <SideBar />
          </div>
          <div className='grow mx-5'>
            {/* Right side content  */}
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default Dashboard;