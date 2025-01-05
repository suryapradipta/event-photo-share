import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ContentCopy,
  Email,
  Facebook,
  Twitter,
  WhatsApp,
} from '@mui/icons-material';
import { useState } from 'react';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  eventUrl: string;
  eventId: string;
}

export function ShareDialog({
  open,
  onClose,
  eventUrl,
  eventId,
}: ShareDialogProps) {
  const [emails, setEmails] = useState('');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(eventUrl);
    setShowCopiedMessage(true);
  };

  const handleEmailShare = async () => {
    try {
      await fetch(`/api/events/${eventId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: emails.split(',').map((email) => email.trim()),
        }),
      });
      onClose();
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };

  const handleSocialShare = (platform: string) => {
    const text = 'Join me at this event and share your photos!';
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          eventUrl
        )}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          eventUrl
        )}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          `${text} ${eventUrl}`
        )}`;
        break;
    }

    window.open(shareUrl, '_blank');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Share Event</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Event Link
            </Typography>
            <TextField
              fullWidth
              value={eventUrl}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={handleCopyLink}>
                    <ContentCopy />
                  </IconButton>
                ),
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Share via Email
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Enter email addresses (comma-separated)"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
            <Button
              variant="contained"
              startIcon={<Email />}
              onClick={handleEmailShare}
              sx={{ mt: 1 }}
            >
              Send Invites
            </Button>
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Share on Social Media
          </Typography>
          <List>
            <ListItem button onClick={() => handleSocialShare('facebook')}>
              <ListItemIcon>
                <Facebook />
              </ListItemIcon>
              <ListItemText primary="Share on Facebook" />
            </ListItem>
            <ListItem button onClick={() => handleSocialShare('twitter')}>
              <ListItemIcon>
                <Twitter />
              </ListItemIcon>
              <ListItemText primary="Share on Twitter" />
            </ListItem>
            <ListItem button onClick={() => handleSocialShare('whatsapp')}>
              <ListItemIcon>
                <WhatsApp />
              </ListItemIcon>
              <ListItemText primary="Share on WhatsApp" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showCopiedMessage}
        autoHideDuration={3000}
        onClose={() => setShowCopiedMessage(false)}
        message="Link copied to clipboard"
      />
    </>
  );
}
