import React, { useContext, useRef } from 'react'
import { AppContext } from "../context/AppContext";
import { useNavigate } from 'react-router-dom';
import { Menu, User, X } from 'lucide-react';
import { assets } from '../assets/assets';
const MenuBar = () => {
    const [openSideMenu, setOpenSideMenu] = React.useState(false);
    const [showDropDown, setShowDropDown] = React.useState(false);
    const dropdownRef = useRef(null);
    const { user } = useContext(AppContext);
    const navigate = useNavigate();
    return (
        <div className='flex items-center justify-between gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sm:px-7 sticky top-0 z-30'>
            {/* Left side -menu button and title */}
            <div className='flex items-center gap-5'>
                <button onClick={() => setOpenSideMenu(!openSideMenu)} className='block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors'>
                    {openSideMenu ? (
                        <X className='text-2xl' />
                    ) : (
                        <Menu className='text-2xl' />
                    )}
                </button>
                <div className='flex items-center gap-2'>
                    <img src={assets.logo} alt="Logo" className='h-10 w-10' />
                    <span className='text-lg font-medium text-black truncate'>WalletWise</span>
                </div>
            </div>
            {/* Right side-Avatar photo */}
            <div className='relative' ref={dropdownRef}></div>
            <button className='flex items-center justify-center h-10 w-10 rounded-full bg-gray-200'>
                <User className='text-gray-600' />
            </button>
            {/* Dropdown menus */}
            {showDropDown && (
                <div className='absolute right-0 top-12 bg-white border border-gray-200 rounded shadow-lg w-48 z-50'>
                    {/* User info */}
                    <div className='px-4 py-3 border-b border-gray-100'>
                        <div className='flex justify-center gap-3'>
                            <div className='flex items-center w-8 h-8 bg-gray-100 rounded-full'>
                                <User className='text-gray-600 w-4 h-4' />
                            </div>

                        </div>
                    </div>
                    {/* Drop options */}
                    <div className='p-1'></div>
                </div>
            )}
            {/* Mobile side menus */}
            <span>Mobile menu</span>
        </div >
    )
}

export default MenuBar