import { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, List, ListItem, ListItemText, 
    ListItemIcon, IconButton, Fab, Dialog, DialogTitle, 
    DialogContent, DialogActions, TextField, MenuItem, 
    Collapse, Paper, alpha, useTheme
} from '@mui/material';
import { 
    Add as AddIcon, 
    YouTube as YoutubeIcon, 
    Delete as DeleteIcon,
    ExpandLess, 
    ExpandMore,
    VideoLibrary as VideoIcon,
    Category as CategoryIcon,
    Link as LinkIcon
} from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import api from '../services/api';

const VideoTutorials = () => {
    const theme = useTheme();
    const [tutorials, setTutorials] = useState({});
    const [open, setOpen] = useState(false);
    const [openCategories, setOpenCategories] = useState({});
    const [formData, setFormData] = useState({ title: '', url: '', category: 'General' });

    useEffect(() => {
        fetchTutorials();
    }, []);

    const fetchTutorials = async () => {
        try {
            const res = await api.get('/tutorials');
            if (res.data.success) {
                // Group by category
                const grouped = res.data.tutorials.reduce((acc, obj) => {
                    const key = obj.category;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(obj);
                    return acc;
                }, {});
                setTutorials(grouped);
                
                // Open all by default
                const catOpen = {};
                Object.keys(grouped).forEach(k => catOpen[k] = true);
                setOpenCategories(catOpen);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleCategory = (cat) => {
        setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/tutorials', formData);
            if (res.data.success) {
                fetchTutorials();
                setOpen(false);
                setFormData({ title: '', url: '', category: 'General' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this tutorial?')) return;
        try {
            await api.delete(`/tutorials/${id}`);
            fetchTutorials();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <VideoIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    Video Tutorials
                </Typography>
            </Box>

            {Object.keys(tutorials).map(category => (
                <Paper key={category} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }} elevation={0} variant="outlined">
                    <ListItem button onClick={() => toggleCategory(category)} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                        <ListItemIcon>
                            <CategoryIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                            primary={category} 
                            primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.2rem' }} 
                        />
                        {openCategories[category] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openCategories[category]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ bgcolor: 'white' }}>
                            {tutorials[category].map((tutorial) => (
                                <ListItem 
                                    key={tutorial.id} 
                                    sx={{ 
                                        pl: 4, 
                                        borderBottom: '1px solid', 
                                        borderColor: 'divider',
                                        '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.02) }
                                    }}
                                >
                                    <ListItemIcon>
                                        <YoutubeIcon color="error" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={tutorial.title} 
                                        secondary={tutorial.url} 
                                        primaryTypographyProps={{ fontWeight: 'medium' }}
                                    />
                                    <Box>
                                        <IconButton color="primary" href={tutorial.url} target="_blank">
                                            <LinkIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(tutorial.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </Paper>
            ))}

            {Object.keys(tutorials).length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 8, opacity: 0.5 }}>
                    <Typography variant="h6">No tutorials added yet.</Typography>
                </Box>
            )}

            <Fab 
                color="primary" 
                aria-label="add" 
                sx={{ position: 'fixed', bottom: 32, right: 32 }}
                onClick={() => setOpen(true)}
            >
                <AddIcon />
            </Fab>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Add Video Tutorial</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ mt: 1 }}>
                        <TextField 
                            fullWidth label="Tutorial Title" sx={{ mb: 2 }} required
                            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                        <TextField 
                            fullWidth label="YouTube / Video URL" sx={{ mb: 2 }} required
                            value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })}
                        />
                        <TextField 
                            select fullWidth label="Category" sx={{ mb: 2 }} 
                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <MenuItem value="General">General</MenuItem>
                            <MenuItem value="iPhone Repair">iPhone Repair</MenuItem>
                            <MenuItem value="Android Repair">Android Repair</MenuItem>
                            <MenuItem value="Soldering">Soldering</MenuItem>
                            <MenuItem value="Software">Software</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">Save Tutorial</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
};

export default VideoTutorials;
