import { Navigate } from 'react-router-dom';
import { useAuthentication } from '../hooks/useAuthentication';

const Dashboard = ({ children }) => {
    const { user } = useAuthentication();
    if (!user) {
        return <Navigate to='/login' />;
    }
    return children;
};

export default Dashboard;
