// Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWorker } from '../apiRepo/workerApi';

const Login = ({ onLogin }: { onLogin: (workerId: number) => void }) => {
  const [workerId, setWorkerId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await loginWorker(parseInt(workerId, 10));
      setErrorMessage('');
      onLogin(parseInt(workerId, 10)); // Call the onLogin callback with the worker ID
      navigate('/'); // Navigate to the home page after successful login
    } catch (error) {
      setErrorMessage('Worker login failed.');
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Worker ID"
        value={workerId}
        onChange={(e) => setWorkerId(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;
