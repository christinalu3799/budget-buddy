import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthentication } from '../hooks/useAuthentication';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import AccountCard from '../components/AccountCard';

const Dashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const { user } = useAuthentication();

    useEffect(() => {
        if (!user) {
            return <Navigate to='/login' />;
        }

        reloadAccounts();
    }, []);

    const reloadAccounts = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/account/accounts/66512dff8c58852592049608',
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        };

        axios
            .request(config)
            .then((response) => {
                console.log(response);
                setAccounts(response.data.accounts);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleAddAccount = async (e) => {
        e.preventDefault();
        // hard coded request, refactor into modal form
        const request = {
            name: 'Test Account 1',
            startingBalance: 100,
            balance: 100,
        };

        try {
            await axios({
                method: 'post',
                origin: true,
                withCredentials: true,
                url: 'http://localhost:3000/account/create',
                data: { ...request },
                headers: { 'Content-Type': 'application/json' },
            }).then((res) => {
                reloadAccounts();
            });
        } catch (e) {
            console.log('Unable to create account. Error: ', e.message);
        }
    };

    return (
        <div className=' h-[100vh] flex flex-col justify-right items-center pt-16'>
            <p className='text-4xl mt-12 mb-12 font-gloria'>Dashboard</p>
            <Button
                className='mb-12'
                variant='primary'
                as='input'
                type='submit'
                value='Add Account'
                onClick={handleAddAccount}
            />
            <div>
                {accounts.map((account, index) => (
                    <AccountCard
                        key={index}
                        accountName={account.name}
                        accountPreviewText={account.startingBalance}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
