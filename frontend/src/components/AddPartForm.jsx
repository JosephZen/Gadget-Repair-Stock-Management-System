import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField,
    FormControl, InputLabel, Select, MenuItem, Box, Typography, IconButton, 
    InputAdornment, alpha, useTheme
} from '@mui/material';
import { 
    Close as CloseIcon,
    Inventory as InventoryIcon,
    Label as LabelIcon,
    Category as CategoryIcon,
    Description as DescriptionIcon,
    AppRegistration as BrandIcon,
    Build as ModelIcon,
    NewReleases as ConditionIcon,
    AddCircle as AddIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useState, useEffect } from 'react';

const AddPartForm = ({ isOpen, onClose, onSubmit, initialData }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        brand: '', model: '', category: 'LCD', condition: 'New', description: '', stock_quantity: 1
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                brand: '', model: '', category: 'LCD', condition: 'New', description: '', stock_quantity: 1
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, overflow: 'hidden' }
            }}
        >
            <DialogTitle sx={{ 
                m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                bgcolor: 'primary.main', color: 'white'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AddIcon />
                    <Typography variant="h6">{initialData ? 'Edit Component' : 'Add New Component'}</Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth 
                                label="Brand" 
                                name="brand" 
                                value={formData.brand} 
                                onChange={e => setFormData({ ...formData, brand: e.target.value })} 
                                required 
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BrandIcon color="action" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth 
                                label="Model" 
                                name="model" 
                                value={formData.model} 
                                onChange={e => setFormData({ ...formData, model: e.target.value })} 
                                required 
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ModelIcon color="action" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select 
                                    name="category" 
                                    label="Category" 
                                    value={formData.category} 
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    startAdornment={(
                                        <InputAdornment position="start" sx={{ ml: 1 }}>
                                            <CategoryIcon color="action" fontSize="small" />
                                        </InputAdornment>
                                    )}
                                >
                                    <MenuItem value="Phone">Phone</MenuItem>
                                    <MenuItem value="Frame">Frame</MenuItem>
                                    <MenuItem value="LCD">LCD</MenuItem>
                                    <MenuItem value="Battery">Battery</MenuItem>
                                    <MenuItem value="Motherboard">Motherboard</MenuItem>
                                    <MenuItem value="Small Parts">Small Parts</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Condition</InputLabel>
                                <Select 
                                    name="condition" 
                                    label="Condition" 
                                    value={formData.condition} 
                                    onChange={e => setFormData({ ...formData, condition: e.target.value })}
                                    startAdornment={(
                                        <InputAdornment position="start" sx={{ ml: 1 }}>
                                            <ConditionIcon color="action" fontSize="small" />
                                        </InputAdornment>
                                    )}
                                >
                                    <MenuItem value="New">New</MenuItem>
                                    <MenuItem value="Used - Excellent">Used - Excellent</MenuItem>
                                    <MenuItem value="Stripped / Salvaged">Stripped / Salvaged</MenuItem>
                                    <MenuItem value="Broken">Broken</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth 
                                label="Stock Quantity" 
                                name="stock_quantity" 
                                type="number" 
                                value={formData.stock_quantity} 
                                onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })} 
                                required 
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <InventoryIcon color="action" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField 
                                fullWidth 
                                multiline 
                                rows={3} 
                                label="Description / Notes" 
                                name="description" 
                                value={formData.description} 
                                onChange={e => setFormData({ ...formData, description: e.target.value })} 
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ mt: 1, alignSelf: 'flex-start' }}>
                                            <DescriptionIcon color="action" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, bgcolor: grey[50] }}>
                    <Button onClick={onClose} variant="outlined" color="inherit">Cancel</Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        startIcon={initialData ? <SaveIcon /> : <AddIcon />}
                        sx={{ px: 3 }}
                    >
                        {initialData ? 'Save Changes' : 'Add Component'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddPartForm;
