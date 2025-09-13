
#!/bin/bash

# Install dependencies for both apps
echo "Installing backend dependencies..."
cd apps/backend && npm install

echo "Installing frontend dependencies..."
cd ../frontend && npm install

# Build frontend
echo "Building frontend..."
npm run build

# Start both services
echo "Starting production servers..."
cd ../backend && npm start &
cd ../frontend && npm start &

wait
