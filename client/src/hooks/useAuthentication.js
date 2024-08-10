import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from './useLocalStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('user', null);
    const navigate = useNavigate();

    const login = async (data) => {
        setUser(data);
        navigate('/dashboard');
    };

    const logout = () => {
        setUser(null);
        navigate('/', { replace: true });
    };

    const redirectToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <AuthContext.Provider
            value={{ user, login, logout, redirectToDashboard }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthentication = () => {
    return useContext(AuthContext);
};
