# Stage 1: Build stage
FROM node:20.12.0-alpine3.19 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Stage 2: Production stage
FROM node:20.12.0-alpine3.19

# Set working directory
WORKDIR /app

# Copy built artifacts from the builder stage
COPY --from=builder /app .

# Copy env file from the local folder to the Docker build context
COPY staging.env .env

# Copy start script
# COPY my-scripts/deployment-scripts/start.sh .

# Make start script executable
# RUN chmod +x start.sh

# Expose port
EXPOSE 80

# Command to start the application
CMD ["npm", "start"]
