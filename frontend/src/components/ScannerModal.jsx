import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
    Dialog, DialogContent, DialogTitle, Box, Typography, 
    CircularProgress, Button, Paper, Grid, Chip, 
    IconButton, Fade, useTheme, Zoom, alpha, Divider,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { 
    Close as CloseIcon, 
    QrCodeScanner as ScannerIcon,
    Inventory as InventoryIcon,
    Refresh as RefreshIcon,
    ErrorOutline as ErrorIcon,
    CameraAlt as CameraIcon
} from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import api from '../services/api';

const ScannerModal = ({ open, onClose }) => {
    const theme = useTheme();
    const [scannedId, setScannedId] = useState(null);
    const [componentData, setComponentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [cameraReady, setCameraReady] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [selectedCameraId, setSelectedCameraId] = useState('');
    const scannerRef = useRef(null);
    const containerId = "qr-reader-modal";

    useEffect(() => {
        if (!open) {
            handleStop();
            return;
        }

        // Delay initialization to ensure the DOM element is ready for the scanner
        const timer = setTimeout(() => {
            handleStart();
        }, 300);

        return () => {
            clearTimeout(timer);
            handleStop();
        };
    }, [open]);

    const handleStart = async (deviceIdToUse = null) => {
        try {
            setError('');
            setCameraReady(false);
            
            // Cleanup previous instance if any
            if (scannerRef.current) {
                await scannerRef.current.stop().catch(() => {});
            }

            const html5QrCode = new Html5Qrcode(containerId);
            scannerRef.current = html5QrCode;

            // Fetch available cameras if we haven't already
            if (cameras.length === 0) {
                try {
                    const devices = await Html5Qrcode.getCameras();
                    if (devices && devices.length > 0) {
                        setCameras(devices);
                        // Default to environment if not explicitly set
                        if (!selectedCameraId) {
                            setSelectedCameraId(devices[0].id);
                        }
                    }
                } catch (err) {
                    console.warn("Failed to get cameras list", err);
                }
            }

            const config = { 
                fps: 10, 
                qrbox: { width: 250, height: 250 } 
            };

            const cameraParam = deviceIdToUse || selectedCameraId || { facingMode: "environment" };

            await html5QrCode.start(
                cameraParam, 
                config, 
                onScanSuccess
            );
            
            setCameraReady(true);
        } catch (err) {
            console.error("Camera Start Error:", err);
            setError("Could not access camera. Please check permissions.");
        }
    };

    const handleCameraChange = async (event) => {
        const newDeviceId = event.target.value;
        setSelectedCameraId(newDeviceId);
        await handleStop();
        handleStart(newDeviceId);
    };

    const handleStop = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            try {
                await scannerRef.current.stop();
                scannerRef.current = null;
            } catch (err) {
                console.error("Camera Stop Error:", err);
            }
        }
        setCameraReady(false);
    };

    const onScanSuccess = (decodedText) => {
        if (scannedId === decodedText) return; // Prevent duplicate triggers
        
        setScannedId(decodedText);
        handleStop(); // Stop camera once successfully scanned
        fetchComponentDetails(decodedText);
    };

    const fetchComponentDetails = async (id) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/components/${id}`);
            if (response.data.success) {
                setComponentData(response.data.component);
            } else {
                setError("Part not found in inventory.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch part data. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setScannedId(null);
        setComponentData(null);
        setError('');
        handleStart();
    };

    const handleModalClose = () => {
        handleStop();
        onClose();
        // Reset state after a delay for smooth transition
        setTimeout(() => {
            setScannedId(null);
            setComponentData(null);
            setError('');
        }, 300);
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleModalClose}
            maxWidth="xs"
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
                    <ScannerIcon />
                    <Typography variant="h6">QR Scanner</Typography>
                </Box>
                <IconButton onClick={handleModalClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, position: 'relative', minHeight: 400, bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
                {/* Camera Selection Dropdown */}
                {!scannedId && cameras.length > 1 && (
                    <Box sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="camera-select-label">Switch Camera</InputLabel>
                            <Select
                                labelId="camera-select-label"
                                value={selectedCameraId}
                                label="Switch Camera"
                                onChange={handleCameraChange}
                                startIcon={<CameraIcon />}
                            >
                                {cameras.map((camera) => (
                                    <MenuItem key={camera.id} value={camera.id}>
                                        {camera.label || `Camera ${camera.id}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}

                {/* Scanner Viewport */}
                {!scannedId && (
                    <Box sx={{ position: 'relative', flex: 1, width: '100%', minHeight: 300 }}>
                         <Box 
                            id={containerId} 
                            sx={{ 
                                width: '100%', 
                                height: '100%',
                                '& video': { objectFit: 'cover' }
                            }} 
                        />
                        
                        {/* Overlay Styling */}
                        {cameraReady && (
                            <Box sx={{ 
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                pointerEvents: 'none', zIndex: 1
                            }}>
                                <Box sx={{ 
                                    width: 250, height: 250, border: '2px solid white', 
                                    borderRadius: 2, boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)',
                                    position: 'relative',
                                    '&::after': {
                                        content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                                        background: theme.palette.primary.main, boxShadow: `0 0 10px ${theme.palette.primary.main}`,
                                        animation: 'scanLine 2s linear infinite'
                                    }
                                }} />
                                <Typography variant="caption" sx={{ color: 'white', mt: 2, fontWeight: 'bold' }}>
                                    Align QR code within the frame
                                </Typography>
                            </Box>
                        )}

                        {!cameraReady && !error && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400 }}>
                                <CircularProgress />
                                <Typography sx={{ mt: 2 }}>Initializing camera...</Typography>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Loading State for Data */}
                {loading && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={60} thickness={4} />
                        <Typography variant="h6" sx={{ mt: 2 }}>Searching Inventory...</Typography>
                    </Box>
                )}

                {/* Result Card */}
                <Fade in={!!componentData && !loading}>
                    <Box sx={{ p: 3 }}>
                        {componentData && (
                            <Paper elevation={0} sx={{ 
                                p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2,
                                bgcolor: alpha(theme.palette.success.light, 0.05)
                            }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                {componentData.brand}
                                            </Typography>
                                            <Typography variant="h6" color="text.secondary">
                                                {componentData.model}
                                            </Typography>
                                        </Box>
                                        <Chip 
                                            label={componentData.condition} 
                                            color={componentData.condition.includes('New') ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">Category</Typography>
                                        <Typography sx={{ fontWeight: 'medium' }}>{componentData.category}</Typography>
                                    </Grid>
                                    
                                    <Grid item xs={6}>
                                         <Typography variant="caption" color="text.secondary">Stock Available</Typography>
                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="h6" color={componentData.stock_quantity > 0 ? 'success.main' : 'error.main'}>
                                                {componentData.stock_quantity}
                                            </Typography>
                                            <InventoryIcon fontSize="small" color="action" />
                                         </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="caption" color="text.secondary">ID</Typography>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: grey[100], p: 0.5, borderRadius: 1 }}>
                                            {componentData.id}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                
                                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                                    <Button 
                                        fullWidth 
                                        variant="contained" 
                                        startIcon={<RefreshIcon />} 
                                        onClick={resetScanner}
                                    >
                                        Scan Another
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        onClick={handleModalClose}
                                    >
                                        Close
                                    </Button>
                                </Box>
                            </Paper>
                        )}
                    </Box>
                </Fade>

                {/* Error State */}
                {error && (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h6" color="error" gutterBottom>Scan Failed</Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>{error}</Typography>
                        <Button variant="outlined" onClick={resetScanner}>Try Again</Button>
                    </Box>
                )}
            </DialogContent>

            <style>{`
                @keyframes scanLine {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(250px); }
                    100% { transform: translateY(0); }
                }
            `}</style>
        </Dialog>
    );
};

export default ScannerModal;
