# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Expose port 4000 to the outside once the container is launched
EXPOSE 4000

# Define the command to run your app (make sure this matches your file structure)
CMD [ "npm", "start" ]
