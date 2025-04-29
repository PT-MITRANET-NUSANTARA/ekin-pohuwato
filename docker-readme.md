# Docker Setup for Next.js, MongoDB, and NGINX

This guide explains how to set up and run the Next.js application with MongoDB and NGINX using Docker.

## Prerequisites

- Docker and Docker Compose installed on your server
- Git to clone the repository

## Setup Instructions

1. Clone the repository to your server:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Create a `.env` file (you can copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Build and start the Docker containers:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Web application: http://your-server-ip
   - MongoDB Express (admin interface): http://your-server-ip/mongo

## Environment Variables

The following environment variables are used:

- `MONGODB_URI`: MongoDB connection string (default: mongodb://mongo:27017/ekin)
- `REDIS_HOST`: Redis host (default: redis)
- `REDIS_PORT`: Redis port (default: 6379)
- `REDIS_PASSWORDD`: Redis password (default: ekinredispassword)

## Accessing the Services

- **Next.js application**: http://your-server-ip
- **MongoDB Express**: http://your-server-ip/mongo (username: admin, password: password)
- **MongoDB**: The MongoDB server is accessible internally at mongo:27017 and externally at your-server-ip:27017
- **Redis**: The Redis server is accessible internally at redis:6379 and externally at your-server-ip:6379

## Directory Structure

- `Dockerfile`: Configuration for building the Next.js application container
- `docker-compose.yml`: Configuration for all services
- `nginx/conf.d/default.conf`: NGINX configuration for proxying requests

## Volumes

The setup uses persistent volumes for:
- MongoDB data: `mongo-data`
- Redis data: `redis-data`

## SSL Configuration (Optional)

To enable HTTPS:

1. Place your SSL certificates in the `nginx/ssl` directory:
   - `nginx/ssl/certificate.crt`
   - `nginx/ssl/private.key`

2. Update the NGINX configuration in `nginx/conf.d/default.conf` to use SSL.

## Troubleshooting

If you encounter any issues:

1. Check the logs:
   ```bash
   docker-compose logs
   ```

2. To view logs for a specific service:
   ```bash
   docker-compose logs nextjs
   docker-compose logs nginx
   docker-compose logs mongo
   ```

3. To restart a service:
   ```bash
   docker-compose restart nginx
   ```

4. To rebuild and restart all services:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ``` 