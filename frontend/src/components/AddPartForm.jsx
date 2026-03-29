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
                sx: { borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }
            }}
        >
            <DialogTitle sx={{ 
                m: 0, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, 
                color: 'white'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <InventoryIcon fontSize="medium" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {initialData ? 'Update Component' : 'New Component Entry'}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 4, bgcolor: '#fafafa' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth 
                                label="Brand" 
                                name="brand" 
                                variant="outlined"
                                value={formData.brand} 
                                onChange={e => setFormData({ ...formData, brand: e.target.value })} 
                                required 
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BrandIcon color="primary" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: '12px', bgcolor: 'white' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth 
                                label="Model" 
                                name="model" 
                                variant="outlined"
                                value={formData.model} 
                                onChange={e => setFormData({ ...formData, model: e.target.value })} 
                                required 
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ModelIcon color="primary" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: '12px', bgcolor: 'white' }
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Category</InputLabel>
                                <Select 
                                    name="category" 
                                    label="Category" 
                                    value={formData.category} 
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    sx={{ borderRadius: '12px', bgcolor: 'white' }}
                                    startAdornment={(
                                        <InputAdornment position="start" sx={{ ml: 1 }}>
                                            <CategoryIcon color="primary" fontSize="small" />
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
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Condition</InputLabel>
                                <Select 
                                    name="condition" 
                                    label="Condition" 
                                    value={formData.condition} 
                                    onChange={e => setFormData({ ...formData, condition: e.target.value })}
                                    sx={{ borderRadius: '12px', bgcolor: 'white' }}
                                    startAdornment={(
                                        <InputAdornment position="start" sx={{ ml: 1 }}>
                                            <ConditionIcon color="primary" fontSize="small" />
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
                                variant="outlined"
                                value={formData.stock_quantity} 
                                onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })} 
                                required 
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <InventoryIcon color="primary" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: '12px', bgcolor: 'white' }
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
                                variant="outlined"
                                value={formData.description} 
                                onChange={e => setFormData({ ...formData, description: e.target.value })} 
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ mt: 1, alignSelf: 'flex-start' }}>
                                            <DescriptionIcon color="primary" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: '12px', bgcolor: 'white' }
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3.5, bgcolor: '#f5f5f5', borderTop: '1px solid #eee' }}>
                    <Button 
                        onClick={onClose} 
                        variant="text" 
                        sx={{ color: 'text.secondary', fontWeight: 600, px: 3 }}
                    >
                        Discard
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        size="large"
                        startIcon={initialData ? <SaveIcon /> : <AddIcon />}
                        sx={{ 
                            px: 5, 
                            borderRadius: '12px', 
                            boxShadow: theme.shadows[4],
                            fontWeight: 600
                        }}
                    >
                        {initialData ? 'Save Changes' : 'Confirm & Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddPartForm;
