import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import QRCode from 'qrcode.react';

interface QRCodeDialogProps {
  open: boolean;
  onClose: () => void;
  accessCode: string;
}

export function QRCodeDialog({ open, onClose, accessCode }: QRCodeDialogProps) {
  const eventUrl = `${window.location.origin}/events/${accessCode}`;

  const handleDownload = () => {
    const canvas = document.getElementById('event-qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `event-qr-${accessCode}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Event QR Code</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <QRCode
            id="event-qr-code"
            value={eventUrl}
            size={256}
            level="H"
            includeMargin
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleDownload} variant="contained" color="primary">
          Download QR Code
        </Button>
      </DialogActions>
    </Dialog>
  );
}
