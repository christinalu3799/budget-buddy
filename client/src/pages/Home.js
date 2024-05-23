import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const [users, setUsers] = useState();

    const fetchUsers = async () => {
        await axios
            .get('http://localhost:3000/users')
            .then((res) => {
                setUsers(res.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    console.log('Here are my users: ', users);
    return (
        <>
            <p className='text-2xl'>Home Page</p>
            <div>
                {users?.map((user, index) => (
                    <p key={user._id} className='h-8'>
                        {user.name}
                    </p>
                ))}
            </div>
        </>
    );
};

export default Home;
