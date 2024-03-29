# Use the official Node.js 14 image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . ./src

# Expose the port on which your Express.js application will run
EXPOSE 3000

# Start the application
CMD ["npm", "start"]