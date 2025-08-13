import React from 'react'
import Dashboard from '../components/Dashboard'
import UserHook from '../hooks/userHook';

const Income = () => {
  UserHook();
  return (
    <Dashboard>
      <h1 className='text-2xl font-bold'>Welcome to the Income</h1>
    </Dashboard>
  )
}

export default Income