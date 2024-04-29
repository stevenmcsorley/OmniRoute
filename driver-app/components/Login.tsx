// Login.tsx for driver login
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { loginEmployee } from '../apiRepo/employeeApi';

function Login() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginEmployee(email);
      if (response.employee.Role !== 'Driver') {
        setErrorMessage('Access restricted to drivers.');
        return;
      }
      localStorage.setItem('employee', JSON.stringify(response.employee));
      router.push('/dashboard'); // Redirect to a driver-specific dashboard
    } catch (error) {
      console.error(error);
      setErrorMessage('Login failed: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default Login;
