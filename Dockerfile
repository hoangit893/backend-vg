# Use the official Node.js 21 image as the base image
#FROM node:21
# FROM --platform=linux/amd64 node:16
FROM --platform=windows/amd64 node:16
# Set the working directory inside the container
WORKDIR /usr/src/app


ENV SEVER_PORT=3000
ENV MONGO_USERNAME="hunt3rr"
ENV MONGO_PASSWORD="aPHxS0HRqRSM2azf"
ENV JWT="VGGAMEGAMING"
ENV HASH_SALT=12
ENV USER="hhoang.it@hotmail.com"
ENV PASSWORD="Hunter0909@!"

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your Express.js application will run
EXPOSE 3000

# Start the application
CMD ["npm", "start"]