import React, { useContext } from 'react';
import MenuBar from './MenuBar';
import { AppContext } from "../context/AppContext";
import SideBar from './SideBar';

const Dashboard = ({ children }) => {
  const { user } = useContext(AppContext);

  return (
    <>
      <MenuBar />
      {user && (
        <div className="flex">
          {/* Sidebar - visible on desktop (fixed left) */}
          <div className="hidden lg:block fixed top-[66px] left-0 h-[calc(100vh-66px)] w-64 bg-white border-r border-gray-200 shadow-sm">
            <SideBar />
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto h-[calc(100vh-66px)] p-5 bg-gray-50 lg:ml-64">
            {children}
          </main>
        </div>
      )}
    </>
  );
};

export default Dashboard;
