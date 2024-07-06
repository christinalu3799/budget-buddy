import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuthentication } from '../hooks/useAuthentication';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { user, redirectToDashboard } = useAuthentication();
    useEffect(() => {
        if (user) {
            console.log(
                `You are already logged in as: ${user.email}\nRedirecting to dashboard...`
            );
            redirectToDashboard();
        }
    });

    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        await axios({
            method: 'post',
            url: 'http://localhost:3000/register',
            data: { name, email, password },
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => {
                console.log(res);
                navigate('/login');
            })
            .catch((res) => {
                console.log('Error registering: ', res);
            });

        setName('');
        setEmail('');
        setPassword('');
    };

    const onNameInput = ({ target: { value: name } }) => {
        setName(name);
    };
    const onEmailInput = ({ target: { value: email } }) => setEmail(email);
    const onPasswordInput = ({ target: { value: password } }) =>
        setPassword(password);

    return (
        <div className='bg-pink-100 h-[100vh] flex flex-col justify-center items-center'>
            <p className='text-8xl mb-12 font-gloria'>Register</p>
            <Form onSubmit={handleRegister} className='flex flex-col w-[300px]'>
                <Form.Label htmlFor='inputName'>Name</Form.Label>
                <Form.Control
                    type='name'
                    id='name'
                    onChange={onNameInput}
                    value={name}
                    className='mb-1'
                />
                <Form.Label htmlFor='inputEmail'>Email</Form.Label>
                <Form.Control
                    type='email'
                    id='email'
                    onChange={onEmailInput}
                    value={email}
                    className='mb-1'
                />
                <Form.Label htmlFor='inputPassword' placeholder='Password'>
                    Password
                </Form.Label>
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
                    value='Register'
                    className='register-btn border-0'
                />
            </Form>
        </div>
    );
};

export default Register;
