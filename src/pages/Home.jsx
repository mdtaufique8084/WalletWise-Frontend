import React from 'react'
import Dashboard from '../components/Dashboard';
import UserHook from '../hooks/userHook';

const Home = () => {
  UserHook();
  return (
    <div>
      <Dashboard >
        <h1 className='text-2xl font-bold'>Welcome to the Dashboard</h1>
      </Dashboard>
    </div>
  )
}

export default Home;