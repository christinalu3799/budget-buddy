import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Nav from 'react-bootstrap/Nav';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './hooks/useAuthentication';

const App = () => {
    return (
        <div className='h-[100vh] w-[100%] relative'>
            <Nav
                activeKey='/'
                className='bg-white w-full absolute flex flex-row justify-end'
            >
                <Nav.Item>
                    <Nav.Link href='/' className='text-dark'>
                        HOME
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href='/register' className='text-dark'>
                        REGISTER
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href='/login' className='text-dark'>
                        LOGIN
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                </Routes>
            </AuthProvider>
        </div>
    );
};

export default App;
