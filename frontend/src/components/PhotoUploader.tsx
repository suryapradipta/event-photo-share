import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { CloudUpload, CheckCircle, Error } from '@mui/icons-material';

interface PhotoUploaderProps {
  onUpload: (file: File) => Promise<void>;
}

export function PhotoUploader({ onUpload }: PhotoUploaderProps) {
  const [uploadStatus, setUploadStatus] = useState<{
    [key: string]: {
      progress: number;
      status: 'uploading' | 'success' | 'error';
      error?: string;
    };
  }>({});

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        setUploadStatus((prev) => ({
          ...prev,
          [file.name]: { progress: 0, status: 'uploading' },
        }));

        try {
          await onUpload(file);
          setUploadStatus((prev) => ({
            ...prev,
            [file.name]: { progress: 100, status: 'success' },
          }));
        } catch (error) {
          setUploadStatus((prev) => ({
            ...prev,
            [file.name]: {
              progress: 0,
              status: 'error',
              error: error.message,
            },
          }));
        }
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          textAlign: 'center',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6">
          {isDragActive
            ? 'Drop the photos here'
            : 'Drag & drop photos here, or click to select'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supports JPEG and PNG up to 10MB
        </Typography>
      </Paper>

      {Object.entries(uploadStatus).length > 0 && (
        <List>
          {Object.entries(uploadStatus).map(([filename, status]) => (
            <ListItem key={filename}>
              <ListItemIcon>
                {status.status === 'success' ? (
                  <CheckCircle color="success" />
                ) : status.status === 'error' ? (
                  <Error color="error" />
                ) : null}
              </ListItemIcon>
              <ListItemText
                primary={filename}
                secondary={
                  status.status === 'error'
                    ? status.error
                    : `${status.progress}% uploaded`
                }
              />
              {status.status === 'uploading' && (
                <Box sx={{ width: '100%', ml: 2 }}>
                  <LinearProgress variant="determinate" value={status.progress} />
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
