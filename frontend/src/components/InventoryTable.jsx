import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, IconButton, Box, TableSortLabel
} from '@mui/material';
import { 
    Delete as DeleteIcon, 
    Edit as EditIcon, 
    Link as LinkIcon 
} from '@mui/icons-material';
import GenerateQR from '../pages/GenerateQR';

const InventoryTable = ({ inventory, sortField, sortOrder, onSort, onEdit, onDelete, onOpenLinks }) => {
    return (
        <Paper sx={{ p: 2, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'brand' || sortField === 'model'}
                                    direction={sortField === 'brand' || sortField === 'model' ? sortOrder : 'asc'}
                                    onClick={() => onSort('brand')}
                                >
                                    Component (Brand & Model)
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'category'}
                                    direction={sortField === 'category' ? sortOrder : 'asc'}
                                    onClick={() => onSort('category')}
                                >
                                    Category
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'condition'}
                                    direction={sortField === 'condition' ? sortOrder : 'asc'}
                                    onClick={() => onSort('condition')}
                                >
                                    Condition
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'stock_quantity'}
                                    direction={sortField === 'stock_quantity' ? sortOrder : 'asc'}
                                    onClick={() => onSort('stock_quantity')}
                                >
                                    Stock
                                </TableSortLabel>
                            </TableCell>
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
                                    <IconButton onClick={() => onOpenLinks(item)} color="info" title="Supplier Links">
                                        <LinkIcon />
                                    </IconButton>
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
