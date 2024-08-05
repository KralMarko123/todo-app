import React, { useRef, useState } from 'react';
import GoogleSheetsService from '../api/googleSheets';
import Spinner from './Spinner';
import './Login.css';

const Login = ({ loginWithUsername }) => {
	const inputRef = useRef(null);
	const [isLoggingIn, setIsLoggingIn] = useState(false);

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') handleLogin();
	};

	const handleLogin = async () => {
		const username = inputRef.current.value;

		if (username.length === 0) return;

		setIsLoggingIn(true);
		const isUserSuccessfullyAdded = await GoogleSheetsService.login(username.toLowerCase());

		if (isUserSuccessfullyAdded === 200) {
			loginWithUsername(username);
		}

		setIsLoggingIn(false);
		inputRef.current.value = '';
	};

	return (
		<div className='container login'>
			<h1 className='title'>Login</h1>

			<h3 className='subtitle'>Please enter a username</h3>

			<input
				type='text'
				className='login input'
				placeholder='Username here...'
				ref={inputRef}
				onKeyDown={(e) => handleKeyDown(e)}
			/>
			<button className='todo_button' onClick={() => handleLogin()}>
				<span>{isLoggingIn ? <Spinner /> : 'Login'}</span>
			</button>
		</div>
	);
};

export default Login;
