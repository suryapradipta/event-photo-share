import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DateTimePicker } from '@mui/x-date-pickers';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Container,
} from '@mui/material';

export default function CreateEvent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    date: new Date(),
    location: '',
    privacyLevel: 'private',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();
      router.push(`/events/${data.accessCode}`);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  if (!session) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" align="center">
          Please sign in to create an event
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Event
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Event Name"
            value={eventData.name}
            onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            value={eventData.description}
            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />

          <DateTimePicker
            label="Event Date & Time"
            value={eventData.date}
            onChange={(newValue) => setEventData({ ...eventData, date: newValue })}
            sx={{ width: '100%', mt: 2 }}
          />

          <TextField
            fullWidth
            label="Location"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Privacy Level</InputLabel>
            <Select
              value={eventData.privacyLevel}
              onChange={(e) => setEventData({ ...eventData, privacyLevel: e.target.value })}
              label="Privacy Level"
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="invite-only">Invite Only</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
          >
            Create Event
          </Button>
        </form>
      </Box>
    </Container>
  );
}
