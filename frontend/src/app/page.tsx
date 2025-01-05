import { Box, Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Event Photo Share
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" gutterBottom>
          Create and share photos from your special events
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            href="/events/create"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mr: 2 }}
          >
            Create Event
          </Button>
          <Button
            component={Link}
            href="/events"
            variant="outlined"
            color="primary"
            size="large"
          >
            View Events
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
