import { useState, useContext, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setUsername(user.username);
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const { data } = await api.put('/auth/profile', { username, password });
            if (data.success) {
                setUser(data.user);
                setPassword('');
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        }
    };

    if (!user) return null;

    return (
        <Container component="main" maxWidth="sm">
            <Box sx={{ marginTop: 8 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography component="h1" variant="h5" gutterBottom>
                        My Profile
                    </Typography>
                    {message.text && (
                        <Alert severity={message.type} sx={{ mb: 2 }}>
                            {message.text}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleUpdate}>
                        <TextField margin="normal" disabled fullWidth label="Email Address" value={user.email} />
                        <TextField margin="normal" required fullWidth label="Username" value={username} onChange={e => setUsername(e.target.value)} />
                        <TextField margin="normal" fullWidth label="New Password (leave blank to keep current)" type="password" value={password} onChange={e => setPassword(e.target.value)} helperText="Only fill this if you want to change your password" />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Update Profile
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Profile;
