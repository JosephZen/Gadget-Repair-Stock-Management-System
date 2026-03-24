import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, IconButton, Box, Button
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import GenerateQR from '../pages/GenerateQR';

const InventoryTable = ({ inventory, onEdit, onDelete, onAdd }) => {
    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Current Stock</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
                    Add New Part
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Component</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Condition</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inventory.map(item => (
                            <TableRow key={item.id} hover>
                                <TableCell>
                                    <Typography variant="subtitle1">{item.brand} {item.model}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                                </TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.condition}</TableCell>
                                <TableCell>
                                    <Typography variant="h6" component="div">{item.stock_quantity}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <GenerateQR componentId={item.id} componentName={`${item.brand} ${item.model}`} category={item.category} />
                                    <IconButton onClick={() => onEdit(item)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => onDelete(item.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default InventoryTable;
