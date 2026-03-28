import { 
    Drawer, Box, List, ListItem, ListItemButton, 
    ListItemIcon, ListItemText, Divider, Typography, 
    IconButton, alpha, useTheme 
} from '@mui/material';
import { 
    Dashboard as DashboardIcon, 
    Person as ProfileIcon, 
    Construction as SolderingIcon, 
    VideoLibrary as VideoIcon, 
    FolderSpecial as FolderIcon,
    ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
        { divider: true },
        { text: 'Soldering Projects', icon: <SolderingIcon />, path: '/soldering', future: true },
        { text: 'Video Tutorials', icon: <VideoIcon />, path: '/tutorials', future: true },
        { text: 'Project Folders', icon: <FolderIcon />, path: '/folders', future: true },
    ];

    const handleNavigation = (path, future) => {
        if (future) {
            alert('This module is coming soon in a future update!');
        } else {
            navigate(path);
            onClose();
        }
    };

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 280,
                    bgcolor: 'background.paper',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                }
            }}
        >
            <Box sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                bgcolor: 'primary.main',
                color: 'white'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Menu
                </Typography>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <ChevronLeftIcon />
                </IconButton>
            </Box>

            <List sx={{ p: 2 }}>
                {menuItems.map((item, index) => (
                    item.divider ? (
                        <Divider key={`divider-${index}`} sx={{ my: 1.5 }} />
                    ) : (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton 
                                onClick={() => handleNavigation(item.path, item.future)}
                                selected={location.pathname === item.path}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: 'primary.main',
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.main',
                                        },
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.15),
                                        }
                                    },
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.action.hover, 0.05),
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text} 
                                    primaryTypographyProps={{ 
                                        fontWeight: location.pathname === item.path ? 'bold' : 'medium',
                                        variant: 'body2'
                                    }}
                                />
                                {item.future && (
                                    <Typography variant="caption" sx={{ 
                                        color: 'text.secondary', 
                                        fontStyle: 'italic',
                                        fontSize: '0.65rem',
                                        bgcolor: grey[100],
                                        px: 0.5,
                                        borderRadius: 0.5
                                    }}>
                                        Soon
                                    </Typography>
                                )}
                            </ListItemButton>
                        </ListItem>
                    )
                ))}
            </List>

            <Box sx={{ mt: 'auto', p: 3, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    Repair Stock Management v1.2
                </Typography>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
