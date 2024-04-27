# Use the official Node.js image as the base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the required dependencies
RUN npm i

# Copy the source code to the working directory
COPY . .

# Expose the port the application will run on
EXPOSE 3001

# Start the Express application
CMD ["node", "app.js"]
