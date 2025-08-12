import React, { useContext, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, User, X } from "lucide-react";
import { assets } from "../assets/assets";
import SideBar from "./SideBar";

const MenuBar = () => {
    const [openSideMenu, setOpenSideMenu] = React.useState(false);
    const [showDropDown, setShowDropDown] = React.useState(false);
    const dropdownRef = useRef(null);
    const { user, clearUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        setShowDropDown(false);
        clearUser();
        navigate("/login");
    };

    return (
        <>
            {/* Top Menu Bar */}
            <div className="flex items-center justify-between bg-white border-b border-gray-200 shadow-sm py-3 px-6 sticky top-0 z-30">

                {/* Left: Hamburger + Logo */}
                <div className="flex items-center gap-4">
                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setOpenSideMenu(!openSideMenu)}
                        className="block lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        {openSideMenu ? <X size={22} /> : <Menu size={22} />}
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img src={assets.logo} alt="Logo" className="h-9 w-9" />
                        <span className="text-lg font-semibold text-gray-800 tracking-tight">
                            WalletWise
                        </span>
                    </div>
                </div>

                {/* Right: User Avatar */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropDown(!showDropDown)}
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 border border-transparent hover:border-gray-300 transition-all"
                    >
                        <User className="text-gray-600 w-5 h-5" />
                    </button>

                    {/* Dropdown */}
                    {showDropDown && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden animate-fadeIn">
                            {/* Profile Info */}
                            <div className="px-4 py-4 border-b border-gray-100 text-center">
                                <div className="mx-auto flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2">
                                    {user?.profileImageUrl ? (
                                        <img
                                            src={user.profileImageUrl}
                                            alt="Profile"
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="text-gray-600 w-6 h-6" />
                                    )}
                                </div>
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user?.fullName || "Guest User"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email || "No email"}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="p-1 space-y-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition"
                                >
                                    <LogOut className="w-4 h-4 text-red-500" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Sidebar */}
            {openSideMenu && (
                <div className="fixed left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20 top-[64px] shadow-md">
                    <SideBar />
                </div>
            )}
        </>
    );
};

export default MenuBar;
