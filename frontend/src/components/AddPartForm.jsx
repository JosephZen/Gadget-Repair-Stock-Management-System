import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useState, useEffect } from 'react';

const AddPartForm = ({ isOpen, onClose, onSubmit, initialData }) => {
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
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{initialData ? 'Edit Part' : 'Add New Part'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Brand" name="brand" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Model" name="model" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select name="category" label="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
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
                                <Select name="condition" label="Condition" value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })}>
                                    <MenuItem value="New">New</MenuItem>
                                    <MenuItem value="Used - Excellent">Used - Excellent</MenuItem>
                                    <MenuItem value="Stripped / Salvaged">Stripped / Salvaged</MenuItem>
                                    <MenuItem value="Broken">Broken</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Stock Quantity" name="stock_quantity" type="number" value={formData.stock_quantity} onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })} required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth multiline rows={3} label="Description / Notes" name="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">{initialData ? 'Save Changes' : 'Add Part'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddPartForm;
