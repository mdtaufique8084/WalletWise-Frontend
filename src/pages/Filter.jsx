import React from 'react'
import Dashboard from '../components/Dashboard'
import UserHook from '../hooks/userHook';

const Filter = () => {
   UserHook();
  return (
    <Dashboard>
      <h1 className='text-2xl font-bold'>Welcome to the Filter</h1>
    </Dashboard>
  )
}

export default Filter