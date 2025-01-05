'use client';

import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            Event Photo Share
          </Typography>
          <Button
            component={Link}
            href="/events"
            color={pathname.startsWith('/events') ? 'primary' : 'inherit'}
            sx={{ ml: 2 }}
          >
            Events
          </Button>
          <Button
            component={Link}
            href="/events/create"
            color={pathname === '/events/create' ? 'primary' : 'inherit'}
            sx={{ ml: 2 }}
          >
            Create Event
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
