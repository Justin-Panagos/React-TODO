# Use official Node.js image (matches your nodeenv version)
FROM node:20.11.1-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (optimizes caching)
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port 3000 (React default)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]