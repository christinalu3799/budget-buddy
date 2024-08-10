import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { useAuthentication } from '../hooks/useAuthentication';
import axios from 'axios';

const NavLink = ({ name, showing, link, cb }) => {
    if (showing) {
        return (
            <Nav.Item>
                <Nav.Link className='text-dark' href={link} onClick={cb}>
                    {name}
                </Nav.Link>
            </Nav.Item>
        );
    }
};
const NavBar = () => {
    const { user, logout } = useAuthentication();
    const handleLogout = async () => {
        // clear local storage
        logout();

        try {
            // end session server side
            await axios({
                method: 'delete',
                origin: true,
                withCredentials: true,
                url: 'http://localhost:3000/logout',
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (e) {
            console.log('Unable to log out. Error: ', e.message);
        }
    };

    return (
        <Nav
            activeKey='/'
            className='bg-slate-100 w-full absolute flex flex-row justify-end'
        >
            <NavLink name='HOME' showing={true} link='/' />
            <NavLink name='REGISTER' showing={true} link='/register' />
            <NavLink name='LOGIN' showing={true} link='/login' />
            <NavLink name='LOGOUT' showing={!!user} cb={handleLogout} />
        </Nav>
    );
};

export default NavBar;
