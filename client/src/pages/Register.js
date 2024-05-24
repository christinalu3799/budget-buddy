import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Register = () => {
    return (
        <div className='bg-pink-100 h-[100vh] flex flex-col justify-center items-center'>
            <p className='text-8xl mb-12 font-gloria'>Register</p>
            <div className='flex flex-col w-[300px]'>
                <Form.Label htmlFor='inputName'>Name</Form.Label>
                <Form.Control type='name' id='name' className='mb-1' />
                <Form.Label htmlFor='inputEmail'>Email</Form.Label>
                <Form.Control type='email' id='email' className='mb-1' />
                <Form.Label htmlFor='inputPassword'>Password</Form.Label>
                <Form.Control type='password' id='password' className='mb-1' />
                <div className='h-4'></div>

                <Button
                    variant='primary'
                    as='input'
                    type='button'
                    value='Register'
                    className='register-btn border-0'
                />
            </div>
        </div>
    );
};

export default Register;
