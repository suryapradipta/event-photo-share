@echo off
echo Starting Event Photo Share application...

echo Installing backend dependencies...
cd backend
call npm install

echo Installing frontend dependencies...
cd ../frontend
call npm install

echo Starting backend server...
start cmd /k "cd backend && npm run start:dev"

echo Starting frontend server...
start cmd /k "cd frontend && npm run dev"

echo Application is starting...
echo Backend will be available at http://localhost:3001
echo Frontend will be available at http://localhost:3000
