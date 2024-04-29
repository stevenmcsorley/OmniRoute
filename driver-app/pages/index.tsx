// index.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { loginEmployee } from '../apiRepo/employeeApi';
import { Page, Navbar, Block, List, ListInput, Button, BlockTitle } from 'konsta/react';

function Login() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginEmployee(email);
      localStorage.setItem('employee', JSON.stringify(response.employee));
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setErrorMessage('Login failed. ' + (error.response?.data?.error || ''));
    }
  };

  return (
    <Page>
      <Navbar title="Login" />
      <Block strong className="p-4">
        <BlockTitle className="mb-4 text-lg font-semibold">Driver Login</BlockTitle>
        <form onSubmit={handleLogin} className="flex flex-col">
          <List inset>
            <ListInput
              label="Email"
              type="email"
              placeholder="Enter Email"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            />
          </List>
          <Button className="mb-4">
            Login
          </Button>
          {errorMessage && (
            <p className="text-red-500">{errorMessage}</p>
          )}
        </form>
      </Block>
    </Page>
  );
}

export default Login;