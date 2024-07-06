import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAuthentication } from '../hooks/useAuthentication';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, user, redirectToDashboard } = useAuthentication();
    useEffect(() => {
        if (user) {
            console.log(
                `You are already logged in as: ${user.email}\nRedirecting to dashboard...`
            );
            redirectToDashboard();
        }
    });

    const onEmailInput = ({ target: { value: email } }) => setEmail(email);
    const onPasswordInput = ({ target: { value: password } }) =>
        setPassword(password);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios({
                method: 'post',
                origin: true,
                withCredentials: true,
                url: 'http://localhost:3000/login',
                data: { email, password },
                headers: { 'Content-Type': 'application/json' },
            }).then((res) => {
                login({ email });
            });
        } catch (e) {
            console.log('Incorrect credentials. Error: ', e.message);
        }
    };

    return (
        <div className='bg-pink-100 h-[100vh] flex flex-col justify-center items-center'>
            <p className='text-8xl mb-12 font-gloria'>Login</p>
            <Form onSubmit={handleLogin} className='flex flex-col w-[300px]'>
                <Form.Label htmlFor='inputEmail'>Email</Form.Label>
                <Form.Control
                    type='email'
                    id='email'
                    onChange={onEmailInput}
                    value={email}
                    className='mb-1'
                />
                <Form.Label htmlFor='inputPassword'>Password</Form.Label>
                <Form.Control
                    type='password'
                    id='password'
                    onChange={onPasswordInput}
                    value={password}
                    className='mb-1'
                />
                <div className='h-4'></div>

                <Button
                    variant='primary'
                    as='input'
                    type='submit'
                    value='Login'
                    className='login-btn border-0'
                />
            </Form>
        </div>
    );
};

export default Login;
