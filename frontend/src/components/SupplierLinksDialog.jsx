import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText, IconButton, Typography, Box, Link } from '@mui/material';
import { Delete as DeleteIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import api from '../services/api';

const SupplierLinksDialog = ({ isOpen, onClose, component }) => {
    const [links, setLinks] = useState([]);
    const [supplierName, setSupplierName] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && component) {
            fetchLinks();
        } else {
            setLinks([]); // reset
            setSupplierName('');
            setLinkUrl('');
        }
    }, [isOpen, component]);

    const fetchLinks = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/components/${component.id}`);
            if (data.success) {
                setLinks(data.links || []);
            }
        } catch (err) {
            console.error("Failed to fetch links", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLink = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/components/${component.id}/links`, { supplier_name: supplierName, link_url: linkUrl });
            setSupplierName('');
            setLinkUrl('');
            fetchLinks();
        } catch (err) {
            console.error("Failed to add link", err);
            alert("Failed to save supplier link");
        }
    };

    const handleDeleteLink = async (linkId) => {
        if (!window.confirm("Delete this link?")) return;
        try {
            await api.delete(`/components/links/${linkId}`);
            fetchLinks();
        } catch (err) {
            console.error("Failed to delete link", err);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Supplier Links 
                {component && <Typography variant="subtitle2" color="text.secondary">{component.brand} {component.model}</Typography>}
            </DialogTitle>
            <DialogContent dividers>
                {loading ? <Typography>Loading links...</Typography> : (
                    links.length === 0 ? <Typography variant="body2" sx={{ mb: 2 }}>No links saved for this component.</Typography> : (
                        <List>
                            {links.map(link => (
                                <ListItem key={link.id} secondaryAction={
                                    <IconButton edge="end" color="error" onClick={() => handleDeleteLink(link.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }>
                                    <ListItemText 
                                        primary={
                                            <Link href={link.link_url} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                {link.supplier_name} <OpenInNewIcon fontSize="small" />
                                            </Link>
                                        } 
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )
                )}
                
                <Box component="form" onSubmit={handleAddLink} sx={{ mt: 3, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>Add New Link</Typography>
                    <TextField fullWidth size="small" label="Supplier Name (e.g. Amazon, iFixit)" value={supplierName} onChange={e => setSupplierName(e.target.value)} required sx={{ mb: 2 }} />
                    <TextField fullWidth size="small" label="URL (https://...)" type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} required sx={{ mb: 2 }} />
                    <Button type="submit" variant="contained" size="small" disabled={!supplierName || !linkUrl}>Save Link</Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SupplierLinksDialog;
