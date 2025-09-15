# Use the official Node.js 22.12+ image
FROM node:22.12-alpine

# Set working directory
WORKDIR /workspace

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3008

# Start the development server
CMD ["npm", "run", "dev"]
