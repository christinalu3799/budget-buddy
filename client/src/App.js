import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Nav from 'react-bootstrap/Nav';

const App = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/users/register' element={<Register />} />
                <Route path='/users/login' element={<Login />} />
            </Routes>
            <div className='h-8'></div>
            <Nav activeKey='/' className='bg-blue-100'>
                <Nav.Item>
                    <Nav.Link href='/'>HOME</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href='/users/register'>REGISTER</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href='/users/login'>LOGIN</Nav.Link>
                </Nav.Item>
            </Nav>
        </>
    );
};

export default App;
