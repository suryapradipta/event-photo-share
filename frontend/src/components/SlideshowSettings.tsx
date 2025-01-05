import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { useState } from 'react';

interface SlideshowSettingsProps {
  open: boolean;
  onClose: () => void;
  settings: {
    transitionEffect: string;
    displayTime: number;
    shuffle: boolean;
    loop: boolean;
  };
  eventId: string;
}

export function SlideshowSettings({
  open,
  onClose,
  settings,
  eventId,
}: SlideshowSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = async () => {
    try {
      await fetch(`/api/events/${eventId}/slideshow-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localSettings),
      });
      onClose();
    } catch (error) {
      console.error('Error saving slideshow settings:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Slideshow Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Transition Effect</InputLabel>
            <Select
              value={localSettings.transitionEffect}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  transitionEffect: e.target.value,
                })
              }
              label="Transition Effect"
            >
              <MenuItem value="fade">Fade</MenuItem>
              <MenuItem value="slide">Slide</MenuItem>
              <MenuItem value="zoom">Zoom</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="number"
            label="Display Time (seconds)"
            value={localSettings.displayTime / 1000}
            onChange={(e) =>
              setLocalSettings({
                ...localSettings,
                displayTime: Number(e.target.value) * 1000,
              })
            }
            margin="normal"
            inputProps={{ min: 1, max: 60 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={localSettings.shuffle}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    shuffle: e.target.checked,
                  })
                }
              />
            }
            label="Shuffle Photos"
          />

          <FormControlLabel
            control={
              <Switch
                checked={localSettings.loop}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    loop: e.target.checked,
                  })
                }
              />
            }
            label="Loop Slideshow"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
}
