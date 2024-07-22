import { Navigate } from 'react-router-dom';
import { useAuthentication } from '../hooks/useAuthentication';
import Button from 'react-bootstrap/Button';

const Dashboard = () => {
    const { user } = useAuthentication();
    if (!user) {
        return <Navigate to='/login' />;
    }

    return (
        <div className=' h-[100vh] flex flex-col justify-right items-center pt-16'>
            <p className='text-2xl mb-12 font-gloria'>Dashboard</p>
            <Button
                variant='primary'
                as='input'
                type='submit'
                value='Add Account'
            />
        </div>
    );
};

export default Dashboard;
