import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { QrCodeScanner as QrCodeScannerIcon } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useScanner } from '../context/ScannerContext';
import ScannerModal from './ScannerModal';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { isScannerOpen, openScanner, closeScanner } = useScanner();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                        Repair Stock Management
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {user ? (
                            <>
                                <Button 
                                    color="inherit" 
                                    startIcon={<QrCodeScannerIcon />}
                                    onClick={openScanner}
                                    sx={{ mr: 2 }}
                                >
                                    Scan QR
                                </Button>
                                <Button color="inherit" component={RouterLink} to="/profile">
                                    {user.username}
                                </Button>
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={RouterLink} to="/login">
                                    Login
                                </Button>
                                <Button color="inherit" component={RouterLink} to="/register">
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <ScannerModal 
                open={isScannerOpen} 
                onClose={closeScanner} 
            />
        </>
    );
};

export default Navbar;
