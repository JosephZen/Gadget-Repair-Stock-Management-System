import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import { Button, Dialog, DialogContent, DialogTitle, Box, Typography, IconButton } from '@mui/material';
import { Print as PrintIcon, QrCode as QrCodeIcon } from '@mui/icons-material';

function GenerateQR({ componentId, componentName, category }) {
    const qrRef = useRef();
    const [open, setOpen] = useState(false);

    const handlePrint = useReactToPrint({
        content: () => qrRef.current,
        documentTitle: `${componentName}-QR`,
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (!componentId) return null;

    return (
        <>
            <IconButton onClick={handleClickOpen} color="secondary">
                <QrCodeIcon />
            </IconButton>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Print QR Code Sticker</DialogTitle>
                <DialogContent>
                    <Box 
                        ref={qrRef} 
                        sx={{
                            p: 3,
                            border: '2px dashed',
                            borderColor: 'grey.400',
                            borderRadius: 2,
                            textAlign: 'center',
                            width: 256, 
                            mx: 'auto'
                        }}
                    >
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                            {componentName}
                        </Typography>
                        <Typography variant="caption" sx={{ textTransform: 'uppercase', mb: 2, display: 'block' }}>
                            {category}
                        </Typography>
                        
                        <QRCodeSVG value={String(componentId)} size={150} level="H" includeMargin={true} />
                        
                        <Typography variant="caption" sx={{ mt: 2, fontFamily: 'monospace', wordBreak: 'break-all', display: 'block' }}>
                            {componentId}
                        </Typography>
                    </Box>
                </DialogContent>
                <Box sx={{ p: 2, textAlign: 'center' }}>
                     <Button 
                        onClick={() => {
                            handlePrint();
                            handleClose();
                        }} 
                        variant="contained"
                        startIcon={<PrintIcon />}
                    >
                        Print Sticker
                    </Button>
                </Box>
            </Dialog>
        </>
    );
}

export default GenerateQR;