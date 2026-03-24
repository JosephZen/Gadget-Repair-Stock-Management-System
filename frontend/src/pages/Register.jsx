import { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Paper, Link } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await register(username, email, password);
        if (success) {
            navigate('/');
        } else {
            setError('Registration failed. Username or email may already exist.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField margin="normal" required fullWidth label="Username" autoFocus
                            value={username} onChange={e => setUsername(e.target.value)} />
                        <TextField margin="normal" required fullWidth label="Email Address" type="email"
                            value={email} onChange={e => setEmail(e.target.value)} />
                        <TextField margin="normal" required fullWidth label="Password" type="password"
                            value={password} onChange={e => setPassword(e.target.value)} />
                        {error && <Typography color="error" variant="body2">{error}</Typography>}
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Sign Up
                        </Button>
                        <Box textAlign="center">
                            <Link component={RouterLink} to="/login" variant="body2">
                                {"Already have an account? Sign In"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register;
