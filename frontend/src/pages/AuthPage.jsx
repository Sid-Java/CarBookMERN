import React, { useState } from 'react';
import { Tabs, Tab, Box, Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import axios from 'axios';

const AuthPage = () => {
  const [tab, setTab] = useState(0);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [snackbar, setSnackbar] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', loginForm);
      setSnackbar(`Welcome ${res.data.user.name}`);
      localStorage.setItem('token', res.data.token);
      window.location.href = res.data.user.role === 'admin' ? '/admin' : '/browse';
    } catch (err) {
      setSnackbar(err.response.data.error);
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', registerForm);
      setSnackbar('Account created. Check your email.');
    } catch (err) {
      setSnackbar(err.response.data.error);
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '4rem' }}>
      <Typography variant="h5" align="center">Welcome</Typography>
      <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)} centered style={{ marginBottom: 20 }}>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>

      {tab === 0 && (
        <Box>
          <TextField fullWidth margin="normal" label="Email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
          <TextField fullWidth type="password" margin="normal" label="Password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
          <Button variant="contained" fullWidth onClick={handleLogin}>Login</Button>
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <TextField fullWidth margin="normal" label="Name" value={registerForm.name} onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })} />
          <TextField fullWidth margin="normal" label="Email" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} />
          <TextField fullWidth type="password" margin="normal" label="Password" value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} />
          <Button variant="contained" fullWidth onClick={handleRegister}>Register</Button>
        </Box>
      )}

      <Snackbar open={!!snackbar} autoHideDuration={4000} onClose={() => setSnackbar('')} message={snackbar} />
    </Container>
  );
};

export default AuthPage;
