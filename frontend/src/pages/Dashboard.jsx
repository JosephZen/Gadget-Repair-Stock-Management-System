import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { Add as AddIcon, QrCodeScanner as QrCodeScannerIcon } from '@mui/icons-material';
import InventoryTable from '../components/InventoryTable';
import AddPartForm from '../components/AddPartForm';
import SupplierLinksDialog from '../components/SupplierLinksDialog';
import { useScanner } from '../context/ScannerContext';
import api from '../services/api';

const Dashboard = () => {
    const [inventory, setInventory] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isLinksOpen, setIsLinksOpen] = useState(false);
    const [linksItem, setLinksItem] = useState(null);
    const { openScanner } = useScanner();

    const fetchInventory = async () => {
        try {
            const res = await api.get('/components');
            if (res.data.success) setInventory(res.data.components);
        } catch (err) {
            console.error("Failed to load inventory", err);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleFormSubmit = async (formData) => {
        try {
            if (editingItem) {
                await api.put(`/components/${editingItem.id}`, formData);
            } else {
                await api.post('/components', formData);
            }
            setIsFormOpen(false);
            setEditingItem(null);
            fetchInventory();
        } catch (err) {
            console.error(err);
            alert(`Failed to ${editingItem ? 'update' : 'add'} part.`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this part?")) {
            try {
                await api.delete(`/components/${id}`);
                fetchInventory();
            } catch (err) {
                console.error(err);
                alert("Failed to delete.");
            }
        }
    };

    const openFormForEdit = (item) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const openFormForAdd = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const handleOpenLinks = (item) => {
        setLinksItem(item);
        setIsLinksOpen(true);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Gadget Repair Stock
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button 
                        variant="outlined" 
                        startIcon={<QrCodeScannerIcon />} 
                        onClick={openScanner}
                        sx={{ borderRadius: 2 }}
                    >
                        Scan QR Code
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={openFormForAdd}
                        sx={{ borderRadius: 2 }}
                    >
                        Add New Part
                    </Button>
                </Stack>
            </Box>

            <InventoryTable 
                inventory={inventory} 
                onEdit={openFormForEdit} 
                onDelete={handleDelete} 
                onAdd={openFormForAdd} 
                onOpenLinks={handleOpenLinks}
                onScan={openScanner}
            />

            <AddPartForm 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                onSubmit={handleFormSubmit} 
                initialData={editingItem} 
            />
            
            <SupplierLinksDialog 
                isOpen={isLinksOpen} 
                onClose={() => setIsLinksOpen(false)} 
                component={linksItem} 
            />
        </Container>
    );
};

export default Dashboard;
