import React from 'react';
import '../App.css';
import { useLocation } from 'react-router';

const Transactions = () => {
    const { state } = useLocation();
    const { accountName } = state;

    return (
        <div className='h-[100vh] flex flex-col justify-right items-center pt-16'>
            <p className='text-4xl mt-12 mb-12 font-gloria'>Transactions</p>
            <p className='text-base mt-12 mb-12'>Account: {accountName}</p>
        </div>
    );
};

export default Transactions;
