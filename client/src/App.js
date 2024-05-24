import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Nav from 'react-bootstrap/Nav';

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
                    <Nav.Link href='/users/register' className='text-dark'>
                        REGISTER
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href='/users/login' className='text-dark'>
                        LOGIN
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/users/register' element={<Register />} />
                <Route path='/users/login' element={<Login />} />
            </Routes>
        </div>
    );
};

export default App;
