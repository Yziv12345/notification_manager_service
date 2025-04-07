# Use Node.js Alpine for a small image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript to JavaScript (if using TS)
RUN npm run build

# Expose the port used by your notification-manager (8080)
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
