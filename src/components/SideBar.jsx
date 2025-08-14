// import React, { useContext } from 'react';
import { AppContext } from "../context/AppContext";
import { User} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { SIDE_BAR_DATA } from '../assets/assets';

const SideBar = () => {
  // const { user } = useContext(AppContext);
  const location = useLocation();

  return (
    <aside className="h-[calc(100vh-66px)] w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Navigation Menu */}
        <nav className="mt-6 px-3">
          {SIDE_BAR_DATA.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.link;
            return (
              <Link
                key={item.id}
                to={item.link}
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default SideBar;
