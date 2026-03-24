import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { Box, Typography, CircularProgress, Button, Paper, Grid, Chip, Link, Snackbar, Alert, Container } from '@mui/material';

function Scanner() {
    const [scannedId, setScannedId] = useState(null);
    const [componentData, setComponentData] = useState(null);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const scannerRef = useRef(null);
    const readerId = "qr-reader";

    useEffect(() => {
        if (scannerRef.current) return;

        const scanner = new Html5QrcodeScanner(
            readerId,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        function onScanSuccess(decodedText) {
            if (isScanning) return; 
            
            scanner.pause();
            setIsScanning(true);
            setShowSuccess(true);
            setScannedId(decodedText);
            fetchComponentDetails(decodedText);
        }

        function onScanError(err) {
            // This is noisy, so we'll keep it quiet.
        }

        scanner.render(onScanSuccess, onScanError);
        scannerRef.current = scanner;

        return () => {
             // The library has some cleanup issues, this is the most reliable way.
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => console.error("Failed to clear scanner", error));
                scannerRef.current = null;
            }
        };
    }, [isScanning]);

    const fetchComponentDetails = async (id) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:3000/api/components/${id}`);
            if (response.data.success) {
                setComponentData(response.data.component);
                setLinks(response.data.links || []);
            } else {
                setError("Component not found.");
            }
        } catch (err) {
            console.error(err);
            setError("Component not found in database.");
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setScannedId(null);
        setComponentData(null);
        setLinks([]);
        setError('');
        setIsScanning(false);
        if (scannerRef.current) {
           scannerRef.current.resume();
        }
    };

    const handleSuccessClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSuccess(false);
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', mt: 4 }}>
                <Typography variant="h4" gutterBottom>Scan Part</Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {!componentData && (
                     <Box 
                        id={readerId} 
                        sx={{ 
                            width: '100%', 
                            border: showSuccess ? '5px solid #4caf50' : '5px solid transparent', 
                            transition: 'border 0.3s ease-in-out',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            my: 2
                        }} 
                    />
                )}
                
                <Snackbar open={showSuccess} autoHideDuration={3000} onClose={handleSuccessClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
                        Scan Successful! Looking up part...
                    </Alert>
                </Snackbar>

                {loading && <CircularProgress sx={{ mt: 2 }} />}

                {componentData && !loading && (
                    <Box sx={{ mt: 3, textAlign: 'left', animation: 'fadeIn 0.5s' }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={8}>
                                <Typography variant="h5">{componentData.brand} {componentData.model}</Typography>
                                <Chip label={componentData.category} color="primary" size="small" />
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                <Chip label={componentData.condition} color={componentData.condition.includes('New') ? 'success' : 'warning'} />
                            </Grid>
                        </Grid>
                        
                        <Box sx={{ my: 2 }}>
                            <Typography><strong>Stock Available:</strong> {componentData.stock_quantity}</Typography>
                            {componentData.description && <Typography><strong>Notes:</strong> {componentData.description}</Typography>}
                            <Typography variant="caption" color="text.secondary">ID: {componentData.id}</Typography>
                        </Box>

                        {links.length > 0 && (
                            <Box>
                                <Typography variant="h6">Reorder Links</Typography>
                                {links.map(link => (
                                    <Link href={link.url} key={link.id} target="_blank" rel="noopener noreferrer" sx={{ display: 'block', my: 1 }}>
                                        {link.store_name} {link.price && `- $${link.price}`}
                                    </Link>
                                ))}
                            </Box>
                        )}
                        
                        <Button variant="contained" fullWidth onClick={resetScanner} sx={{ mt: 3 }}>
                            Scan Another Part
                        </Button>
                    </Box>
                )}
            </Paper>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </Container>
    );
}

export default Scanner;