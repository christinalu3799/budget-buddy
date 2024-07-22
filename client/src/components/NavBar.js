import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { useAuthentication } from '../hooks/useAuthentication';

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
    console.log('user = ', !!user);
    const handleLogout = () => {
        logout();
        console.log('Successfully logged out.');
    };

    return (
        <Nav
            activeKey='/'
            className='bg-slate-300 w-full absolute flex flex-row justify-end'
        >
            <NavLink name='HOME' showing={true} link='/' />
            <NavLink name='REGISTER' showing={true} link='/register' />
            <NavLink name='LOGIN' showing={true} link='/login' />
            <NavLink name='LOGOUT' showing={!!user} cb={handleLogout} />
        </Nav>
    );
};

export default NavBar;
