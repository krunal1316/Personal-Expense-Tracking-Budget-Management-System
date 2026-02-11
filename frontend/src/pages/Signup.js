import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';

function Signup() {

    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError('name, email and password are required')
        }
        try {
            const url = `${APIUrl}/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }
    return (
        <div className='container' style={{ maxWidth: '400px', marginTop: '50px' }}>
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <div className='form-group'>
                    <label htmlFor='name' className='form-label'>Name</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='name'
                        autoFocus
                        className='form-control'
                        placeholder='Enter your name...'
                        value={signupInfo.name}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='email' className='form-label'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        className='form-control'
                        placeholder='Enter your email...'
                        value={signupInfo.email}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='password' className='form-label'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        className='form-control'
                        placeholder='Enter your password...'
                        value={signupInfo.password}
                    />
                </div>
                <button type='submit' className='btn btn-primary btn-block'>Signup</button>
                <span style={{ display: 'block', marginTop: '10px', textAlign: 'center' }}>
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Signup