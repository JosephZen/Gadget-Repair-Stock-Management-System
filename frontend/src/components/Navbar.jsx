import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { 
    QrCodeScanner as QrCodeScannerIcon, 
    Menu as MenuIcon 
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useScanner } from '../context/ScannerContext';
import ScannerModal from './ScannerModal';
import Sidebar from './Sidebar';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { isScannerOpen, openScanner, closeScanner } = useScanner();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {user && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => setIsSidebarOpen(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
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

            <Sidebar 
                open={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />
        </>
    );
};

export default Navbar;
