import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { loginWorker } from '../apiRepo/workerApi';
import { Page, Navbar, Block, List, ListInput, Button, BlockTitle } from 'konsta/react';

function Login() {
  const [workerId, setWorkerId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const workerIdNumber = parseInt(workerId);
      const response = await loginWorker(workerIdNumber);
      localStorage.setItem('workerId', workerId);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setErrorMessage('Worker login failed.');
    }
  };

  return (
    <Page>
      <Navbar title="Login" />
      <Block strong className="p-4">
        <BlockTitle className="mb-4 text-lg font-semibold">Worker Login</BlockTitle>
        <form onSubmit={handleLogin} className="flex flex-col">
          <List inset>
            <ListInput
              label="Worker ID"
              type="text"
              placeholder="Enter Worker ID"
              value={workerId}
              onInput={(e) => setWorkerId((e.target as HTMLInputElement).value)}
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
