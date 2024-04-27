# Use the official Node.js 16 Alpine image as the base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app using npm
CMD ["npm", "start"]
