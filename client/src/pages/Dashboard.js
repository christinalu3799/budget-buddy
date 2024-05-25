import { Navigate } from 'react-router-dom';
import { useAuthentication } from '../hooks/useAuthentication';
import Nav from 'react-bootstrap/Nav';

const Dashboard = () => {
    const { logout } = useAuthentication();
    const handleLogout = () => {
        logout();
    };
    const { user } = useAuthentication();
    if (!user) {
        return <Navigate to='/login' />;
    }
    return (
        <div className='bg-pink-100 h-[100vh] flex flex-col justify-center items-center'>
            <p className='text-8xl mb-12 font-gloria'>Dashboard</p>
            <Nav.Item>
                <Nav.Link onClick={handleLogout} className='text-dark'>
                    LOGOUT
                </Nav.Link>
            </Nav.Item>
        </div>
    );
};

export default Dashboard;
