import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar.js';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions.js';
import { AuthProvider } from './hooks/useAuthentication';

const App = () => {
    return (
        <div className='h-[100vh] w-[100%] relative'>
            <AuthProvider>
                <NavBar />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/transactions' element={<Transactions />} />
                </Routes>
            </AuthProvider>
        </div>
    );
};

export default App;
