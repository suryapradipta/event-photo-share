# Event Photo Share

A modern event photo sharing platform that allows event hosts to create events and attendees to share photos in real-time.

## Features

- Create events with customizable details (name, date, time, location)
- Privacy settings (public, private, invite-only)
- Unique QR code generation for each event
- Real-time photo uploads with automatic optimization
- Dynamic slideshow with customizable settings
- Social sharing options
- User authentication with social login
- Batch photo downloads for hosts

## Tech Stack

### Frontend
- Next.js with TypeScript
- Material-UI for components
- Socket.IO client for real-time updates
- React Dropzone for file uploads
- QRCode.js for QR code generation

### Backend
- NestJS with TypeScript
- PostgreSQL with TypeORM
- Redis for caching and real-time features
- MinIO (S3-compatible storage)
- Socket.IO for WebSocket connections

### Infrastructure
- Docker & Docker Compose
- AWS S3 (or MinIO for development)
- JWT for authentication

## Prerequisites

- Node.js 18 or later
- Docker and Docker Compose
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/event-photo-share.git
   cd event-photo-share
   ```

2. Create environment files:

   Backend (.env):
   ```env
   NODE_ENV=development
   DATABASE_URL=postgresql://eventapp:eventapp123@postgres:5432/eventapp
   REDIS_URL=redis://redis:6379
   S3_ENDPOINT=http://minio:9000
   S3_ACCESS_KEY=minioaccess
   S3_SECRET_KEY=miniosecret
   S3_BUCKET=event-photos
   JWT_SECRET=your-jwt-secret-key
   CORS_ORIGIN=http://localhost:3000
   ```

   Frontend (.env.local):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_WS_URL=ws://localhost:3001
   ```

3. Start the development environment:
   ```bash
   docker-compose up -d
   ```

4. Initialize the database:
   ```bash
   docker-compose exec backend npm run migration:run
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MinIO Console: http://localhost:9001

## Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
npm install
npm run start:dev
```

### Database Migrations
```bash
# Create a new migration
npm run migration:create

# Run migrations
npm run migration:run

# Revert migrations
npm run migration:revert
```

## Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
npm run test
```

## Deployment

1. Build Docker images:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. Deploy to your cloud provider:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
