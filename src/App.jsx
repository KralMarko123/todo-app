import React, { useState } from 'react';
import Login from './components/Login';
import Main from './components/Main';

const App = () => {
	const [user, setUser] = useState(window.sessionStorage.getItem('username'));

	const handleLogin = (username) => {
		window.sessionStorage.setItem('username', username);
		setUser(username);
	};

	return (
		<div className='todo_app'>
			{!user ? <Login loginWithUsername={handleLogin} /> : <Main username={user} />}
		</div>
	);
};

export default App;
