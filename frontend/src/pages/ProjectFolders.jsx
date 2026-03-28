import { useState, useEffect } from 'react';
import { 
    Container, Box, Typography, Card, CardContent, IconButton, 
    Breadcrumbs, Link, Grid, Button, Fab, Dialog, DialogTitle, 
    DialogContent, DialogActions, TextField, Menu, MenuItem, 
    alpha, useTheme, List, ListItem, ListItemIcon, ListItemText,
    Paper
} from '@mui/material';
import { 
    Folder as FolderIcon,
    InsertDriveFile as FileIcon,
    NavigateNext as NavigateNextIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    MoreVert as MoreIcon,
    Link as LinkIcon,
    ArrowBack as BackIcon,
    CreateNewFolder as NewFolderIcon
} from '@mui/icons-material';
import { grey, blue } from '@mui/material/colors';
import api from '../services/api';

const ProjectFolders = () => {
    const theme = useTheme();
    const [folders, setFolders] = useState([]);
    const [currentPath, setCurrentPath] = useState([]); // [{id, name}]
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', link_url: '' });

    useEffect(() => {
        fetchFolders();
    }, [currentPath]);

    const fetchFolders = async () => {
        const parentId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : '';
        try {
            const res = await api.get(`/folders?parentId=${parentId}`);
            if (res.data.success) {
                setFolders(res.data.folders);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleFolderClick = (id, name) => {
        setCurrentPath([...currentPath, { id, name }]);
    };

    const navigateBack = (index) => {
        if (index === -1) {
            setCurrentPath([]);
        } else {
            setCurrentPath(currentPath.slice(0, index + 1));
        }
    };

    const isFolder = (item) => !item.link_url;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const parentId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;
        try {
            const res = await api.post('/folders', { ...formData, parent_id: parentId });
            if (res.data.success) {
                setFolders([...folders, res.data.folder]);
                setOpen(false);
                setFormData({ name: '', link_url: '' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item? Everything inside will be lost.')) return;
        try {
            await api.delete(`/folders/${id}`);
            setFolders(folders.filter(f => f.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FolderIcon sx={{ fontSize: 40, color: blue[500] }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Project Folders</Typography>
                </Box>
            </Box>

            {/* Breadcrumbs Navigation */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Link 
                        underline="hover" color="inherit" sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        onClick={() => navigateBack(-1)}
                    >
                        <FolderIcon sx={{ mr: 0.5 }} />
                        Root
                    </Link>
                    {currentPath.map((item, index) => (
                        <Link 
                            key={item.id} underline="hover" color="inherit" 
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigateBack(index)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </Breadcrumbs>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={2}>
                        {folders.map((item) => (
                            <Grid item key={item.id} xs={12} sm={6} md={3}>
                                <Card sx={{ 
                                    borderRadius: 2, 
                                    border: '1px solid', 
                                    borderColor: 'divider',
                                    transition: '0.2s',
                                    boxShadow: 'none',
                                    '&:hover': { 
                                        borderColor: 'primary.main', 
                                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                                        cursor: 'pointer'
                                    }
                                }} onClick={() => isFolder(item) ? handleFolderClick(item.id, item.name) : window.open(item.link_url, '_blank')}>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: '16px !important' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            {isFolder(item) ? (
                                                <FolderIcon sx={{ fontSize: 40, color: blue[400] }} />
                                            ) : (
                                                <LinkIcon sx={{ fontSize: 40, color: 'success.main' }} />
                                            )}
                                        </Box>
                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                            <Typography variant="body1" noWrap sx={{ fontWeight: 'bold' }}>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {isFolder(item) ? 'Folder' : 'Link'}
                                            </Typography>
                                        </Box>
                                        <IconButton 
                                            size="small" 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                            sx={{ '&:hover': { color: 'error.main' } }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {folders.length === 0 && (
                        <Box sx={{ textAlign: 'center', mt: 8, opacity: 0.5 }}>
                            <Typography variant="h6">This folder is empty.</Typography>
                        </Box>
                    )}
                </>
            )}

            <Box sx={{ position: 'fixed', bottom: 32, right: 32, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Fab color="primary" onClick={() => setOpen(true)}>
                    <AddIcon />
                </Fab>
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ bgcolor: blue[600], color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NewFolderIcon />
                        New Item
                    </Box>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ mt: 1 }}>
                        <TextField 
                            fullWidth label="Name" sx={{ mb: 2 }} required
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField 
                            fullWidth label="Link URL (Optional)" sx={{ mb: 2 }} placeholder="Leave empty for Folder"
                            value={formData.link_url} onChange={e => setFormData({ ...formData, link_url: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">Create</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
};

export default ProjectFolders;
