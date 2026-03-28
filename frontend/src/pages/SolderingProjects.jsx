import { useState, useEffect } from 'react';
import { 
    Container, Grid, Card, CardContent, CardMedia, Typography, 
    Button, Box, IconButton, Fab, Dialog, DialogTitle, 
    DialogContent, DialogActions, TextField, alpha, useTheme 
} from '@mui/material';
import { 
    Add as AddIcon, 
    OpenInNew as OpenIcon, 
    Delete as DeleteIcon,
    Construction as SolderingIcon,
    Link as LinkIcon,
    Image as ImageIcon
} from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import api from '../services/api';

const SolderingProjects = () => {
    const theme = useTheme();
    const [projects, setProjects] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', image_url: '', drive_link: '' });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/soldering');
            if (res.data.success) setProjects(res.data.projects);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/soldering', formData);
            if (res.data.success) {
                setProjects([res.data.project, ...projects]);
                setOpen(false);
                setFormData({ title: '', description: '', image_url: '', drive_link: '' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await api.delete(`/soldering/${id}`);
            setProjects(projects.filter(p => p.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SolderingIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    Soldering Projects
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {projects.map((project) => (
                            <Grid item key={project.id} xs={12} sm={6} md={4}>
                                <Card sx={{ 
                                    height: '100%', display: 'flex', flexDirection: 'column', 
                                    borderRadius: 3, overflow: 'hidden', transition: '0.3s',
                                    '&:hover': { transform: 'translateY(-5px)', boxShadow: theme.shadows[10] }
                                }}>
                                    {project.image_url ? (
                                        <CardMedia component="img" height="200" image={project.image_url} alt={project.title} />
                                    ) : (
                                        <Box sx={{ height: 200, bgcolor: grey[200], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ImageIcon sx={{ fontSize: 60, color: grey[400] }} />
                                        </Box>
                                    )}
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                                            {project.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {project.description}
                                        </Typography>
                                        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Button 
                                                variant="outlined" 
                                                size="small" 
                                                startIcon={<OpenIcon />}
                                                href={project.drive_link}
                                                target="_blank"
                                                disabled={!project.drive_link}
                                            >
                                                Google Drive
                                            </Button>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(project.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {projects.length === 0 && (
                        <Box sx={{ textAlign: 'center', mt: 8, opacity: 0.5 }}>
                            <Typography variant="h6">No projects added yet.</Typography>
                        </Box>
                    )}
                </>
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
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Add Soldering Project</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ mt: 1 }}>
                        <TextField 
                            fullWidth label="Project Title" sx={{ mb: 2 }} required
                            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                        <TextField 
                            fullWidth label="Description" sx={{ mb: 2 }} multiline rows={3}
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                        <TextField 
                            fullWidth label="Image URL" sx={{ mb: 2 }} 
                            value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                        />
                        <TextField 
                            fullWidth label="Google Drive Link" sx={{ mb: 2 }}
                            value={formData.drive_link} onChange={e => setFormData({ ...formData, drive_link: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">Save Project</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
};

export default SolderingProjects;
