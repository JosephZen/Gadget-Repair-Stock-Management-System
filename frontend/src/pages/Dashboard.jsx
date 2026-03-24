import { useState, useEffect } from 'react';
import { Box, Container, Tabs, Tab } from '@mui/material';
import { Add as AddIcon, QrCodeScanner as QrCodeScannerIcon } from '@mui/icons-material';
import Scanner from './Scanner';
import InventoryTable from '../components/InventoryTable';
import AddPartForm from '../components/AddPartForm';
import api from '../services/api';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [inventory, setInventory] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

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
                alert('Part updated successfully!');
            } else {
                await api.post('/components', formData);
                alert('Part added successfully!');
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

    return (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
                        <Tab label="Inventory" icon={<AddIcon />} iconPosition="start" />
                        <Tab label="Scan QR" icon={<QrCodeScannerIcon />} iconPosition="start" />
                    </Tabs>
                </Box>
                <Box sx={{ p: 3, mt: 2 }}>
                    {activeTab === 0 && (
                        <InventoryTable 
                            inventory={inventory} 
                            onEdit={openFormForEdit} 
                            onDelete={handleDelete} 
                            onAdd={openFormForAdd} 
                        />
                    )}
                    {activeTab === 1 && <Scanner />}
                </Box>
            </Box>
            <AddPartForm 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                onSubmit={handleFormSubmit} 
                initialData={editingItem} 
            />
        </Container>
    );
};

export default Dashboard;
