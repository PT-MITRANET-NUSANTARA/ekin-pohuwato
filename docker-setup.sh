#!/bin/bash

# Docker setup script for Next.js, MongoDB, and NGINX

# Make sure script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or with sudo"
  exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Installing Docker..."
  apt-get update
  apt-get install -y docker.io
  systemctl enable docker
  systemctl start docker
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
  echo "Docker Compose is not installed. Installing Docker Compose..."
  
  # For Docker Compose V2
  apt-get update
  apt-get install -y docker-compose-plugin
  
  # If that doesn't work, try the standalone version
  if ! command -v docker-compose &> /dev/null; then
    apt-get install -y curl
    LATEST_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -o -P '(?<="tag_name": ").+(?=")')
    curl -L "https://github.com/docker/compose/releases/download/${LATEST_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
  fi
fi

# Create directories for MongoDB and Redis data if they don't exist
mkdir -p ./nginx/ssl

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  echo "MONGODB_URI=mongodb://mongo:27017/ekin" > .env
  echo "REDIS_HOST=redis" >> .env
  echo "REDIS_PORT=6379" >> .env
  echo "REDIS_PASSWORDD=ekinredispassword" >> .env
  echo "NODE_ENV=production" >> .env
fi

# Make sure the script is executable
chmod +x docker-setup.sh

echo "Starting Docker containers..."
docker-compose down
docker-compose up -d --build

# Get the server's IP address
SERVER_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "Docker setup completed!"
echo ""
echo "Your application is now running at:"
echo "* Web application: http://$SERVER_IP"
echo "* MongoDB Express: http://$SERVER_IP/mongo (username: admin, password: password)"
echo ""
echo "To check logs, run: docker-compose logs"
echo "To stop the containers, run: docker-compose down"
echo "" 