# Use Node.js Alpine for a small image
FROM node:18-alpine

# Install bash and curl (to get wait-for-it)
RUN apk add --no-cache bash curl

# Download the wait-for-it script
RUN curl -o /usr/local/bin/wait-for-it https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
  && chmod +x /usr/local/bin/wait-for-it

# Set working directory inside the container
WORKDIR /app

# Copy package*.json (dependencies) and install
COPY package*.json ./
RUN npm install

# Copy source code to the container
COPY . .

# Build TypeScript to JavaScript (if using TS)
RUN npm run build

# Expose the port your application will run on
EXPOSE 8080

# Start the server using wait-for-it to wait for the notification-service to be ready
CMD ["wait-for-it", "notification-service:5001", "--", "npm", "start"]
