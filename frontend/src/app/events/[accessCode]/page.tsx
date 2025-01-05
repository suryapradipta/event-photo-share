import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import { Share, Settings, CloudDownload, QrCode } from '@mui/icons-material';
import { Carousel } from 'react-responsive-carousel';
import { PhotoUploader } from '@/components/PhotoUploader';
import { SlideshowSettings } from '@/components/SlideshowSettings';
import { ShareDialog } from '@/components/ShareDialog';
import { QRCodeDialog } from '@/components/QRCodeDialog';

export default function EventPage() {
  const { accessCode } = useParams();
  const { data: session } = useSession();
  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // Connect to WebSocket
    const socket = io(process.env.NEXT_PUBLIC_WS_URL);
    socket.emit('joinEvent', accessCode);

    socket.on('newPhoto', (photo) => {
      setPhotos((prev) => [...prev, photo]);
    });

    // Fetch event details
    fetchEventDetails();

    return () => {
      socket.disconnect();
    };
  }, [accessCode]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`/api/events/${accessCode}`);
      const data = await response.json();
      setEvent(data);
      setIsHost(session?.user?.id === data.host.id);
      setPhotos(data.photos);
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const handlePhotoUpload = async (file) => {
    const formData = new FormData();
    formData.append('photo', file);

    try {
      await fetch(`/api/events/${accessCode}/photos`, {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const handleDownloadPhotos = async () => {
    try {
      const response = await fetch(`/api/events/${accessCode}/photos/download`);
      const { downloadUrl } = await response.json();
      window.location.href = downloadUrl;
    } catch (error) {
      console.error('Error downloading photos:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" component="h1">
              {event?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {new Date(event?.date).toLocaleString()}
            </Typography>
          </Grid>
          
          <Grid item>
            <IconButton onClick={() => setShowShare(true)}>
              <Share />
            </IconButton>
            <IconButton onClick={() => setShowQR(true)}>
              <QrCode />
            </IconButton>
            {isHost && (
              <>
                <IconButton onClick={() => setShowSettings(true)}>
                  <Settings />
                </IconButton>
                <IconButton onClick={handleDownloadPhotos}>
                  <CloudDownload />
                </IconButton>
              </>
            )}
          </Grid>
        </Grid>

        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Slideshow" />
          <Tab label="Gallery" />
          <Tab label="Upload" />
        </Tabs>

        {activeTab === 0 && (
          <Carousel
            autoPlay
            interval={event?.slideshowSettings?.displayTime || 5000}
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            {...event?.slideshowSettings}
          >
            {photos.map((photo) => (
              <div key={photo.id}>
                <img src={photo.optimizedUrl} alt="Event photo" />
              </div>
            ))}
          </Carousel>
        )}

        {activeTab === 1 && (
          <Grid container spacing={2}>
            {photos.map((photo) => (
              <Grid item xs={12} sm={6} md={4} key={photo.id}>
                <img
                  src={photo.thumbnailUrl}
                  alt="Event photo"
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 2 && (
          <PhotoUploader onUpload={handlePhotoUpload} />
        )}

        <SlideshowSettings
          open={showSettings}
          onClose={() => setShowSettings(false)}
          settings={event?.slideshowSettings}
          eventId={event?.id}
        />

        <ShareDialog
          open={showShare}
          onClose={() => setShowShare(false)}
          eventUrl={`${window.location.origin}/events/${accessCode}`}
          eventId={event?.id}
        />

        <QRCodeDialog
          open={showQR}
          onClose={() => setShowQR(false)}
          accessCode={accessCode}
        />
      </Box>
    </Container>
  );
}
