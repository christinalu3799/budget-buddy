import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthentication } from '../hooks/useAuthentication';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import AccountCard from '../components/AccountCard';

const Dashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [accountName, setAccountName] = useState('');
    const [startingBalance, setStartingBalance] = useState('');
    const { user } = useAuthentication();

    useEffect(() => {
        if (!user) {
            return <Navigate to='/login' />;
        }

        reloadAccounts();
    }, []);

    const onAccountNameInput = ({ target: { value: accountName } }) =>
        setAccountName(accountName);
    const onStartingBalanceInput = ({ target: { value: startingBalance } }) =>
        setStartingBalance(startingBalance);

    const reloadAccounts = async () => {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/account/accounts/66512dff8c58852592049608',
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        };

        await axios
            .request(config)
            .then((response) => {
                setAccounts(response.data.accounts);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleAddAccount = async (e) => {
        e.preventDefault();

        const request = {
            name: accountName,
            startingBalance: startingBalance,
            balance: startingBalance,
        };

        try {
            await axios({
                method: 'post',
                origin: true,
                withCredentials: true,
                url: 'http://localhost:3000/account/create',
                data: request,
                headers: { 'Content-Type': 'application/json' },
            }).then(() => {
                reloadAccounts();
                setAccountName('');
                setStartingBalance('');
            });
        } catch (e) {
            console.log('Unable to create account. Error: ', e.message);
        }
    };

    return (
        <div className='min-h-full flex flex-col justify-right items-center pt-16 pb-16'>
            <p className='text-4xl mt-12 mb-12 font-gloria'>Dashboard</p>
            <Form
                onSubmit={handleAddAccount}
                className='flex flex-col w-[300px]'
            >
                <Form.Label htmlFor='inputAccountName'>
                    Account Name:
                </Form.Label>
                <Form.Control
                    id='accountName'
                    type='accountName'
                    onChange={onAccountNameInput}
                    value={accountName}
                    className='mb-1'
                />
                <Form.Label htmlFor='inputStartingBalance'>
                    Starting Balance:
                </Form.Label>
                <Form.Control
                    id='startingBalance'
                    type='startingBalance'
                    onChange={onStartingBalanceInput}
                    value={startingBalance}
                    className='mb-1'
                />
                <div className='h-4'></div>
                <Button
                    className='mb-12'
                    variant='success'
                    as='input'
                    type='submit'
                    value='Add Account'
                    onClick={handleAddAccount}
                />
            </Form>

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
