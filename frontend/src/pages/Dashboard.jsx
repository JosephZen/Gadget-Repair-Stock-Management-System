import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Stack, TextField, InputAdornment } from '@mui/material';
import { 
    Add as AddIcon, 
    QrCodeScanner as QrCodeScannerIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import InventoryTable from '../components/InventoryTable';
import AddPartForm from '../components/AddPartForm';
import SupplierLinksDialog from '../components/SupplierLinksDialog';
import { useScanner } from '../context/ScannerContext';
import api from '../services/api';
import { showErrorAlert, showSuccessAlert, showConfirmDelete } from '../utils/alerts';

const Dashboard = () => {
    const [inventory, setInventory] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const { openScanner } = useScanner();
    const [isLinksOpen, setIsLinksOpen] = useState(false);
    const [linksItem, setLinksItem] = useState(null);

    // ✅ Search and Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('category'); // Default sort
    const [sortOrder, setSortOrder] = useState('asc');

    // ✅ Sorting and Filtering logic
    const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortField(field);
    };

    const getFilteredAndSortedInventory = () => {
        // 1. Filter by search query
        let filtered = inventory.filter(item => 
            item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        // 2. Sort
        return filtered.sort((a, b) => {
            let valA = a[sortField] || '';
            let valB = b[sortField] || '';

            // Handle numeric sorting for stock
            if (sortField === 'stock_quantity') {
                return sortOrder === 'asc' ? a.stock_quantity - b.stock_quantity : b.stock_quantity - a.stock_quantity;
            }

            // Group same models together if sorting by brand/model
            if (sortField === 'brand' || sortField === 'model') {
                const brandMatch = a.brand.localeCompare(b.brand);
                if (brandMatch !== 0) return sortOrder === 'asc' ? brandMatch : -brandMatch;
                return a.model.localeCompare(b.model) * (sortOrder === 'asc' ? 1 : -1);
            }

            // Default string sorting
            const comparison = String(valA).localeCompare(String(valB));
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    };

    const displayInventory = getFilteredAndSortedInventory();

    const fetchInventory = async () => {
        try {
            const res = await api.get('/components');
            if (res.data.success) {
                setInventory(res.data.components);
            }
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
                showSuccessAlert('Updated', 'Part details successfully updated.');
            } else {
                await api.post('/components', formData);
                showSuccessAlert('Added', 'New part successfully added to stock.');
            }
            setIsFormOpen(false);
            setEditingItem(null);
            fetchInventory();
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 409) {
                showErrorAlert('Duplicate Entry', err.response.data.message);
            } else {
                showErrorAlert('Error', `Failed to ${editingItem ? 'update' : 'add'} part.`);
            }
        }
    };

    const handleDelete = async (id) => {
        const confirmed = await showConfirmDelete("Delete Part?", "This will permanently remove the item from your stock.");
        if (confirmed) {
            try {
                await api.delete(`/components/${id}`);
                showSuccessAlert('Deleted', 'Part has been removed.');
                fetchInventory();
            } catch (err) {
                console.error(err);
                showErrorAlert('Error', 'Failed to delete part.');
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
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Inventory Management
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

            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by brand, model, category, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 3, bgcolor: 'background.paper', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }
                    }}
                />
            </Box>

            <InventoryTable
                inventory={displayInventory}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                onEdit={openFormForEdit}
                onDelete={handleDelete}
                onOpenLinks={handleOpenLinks}
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
