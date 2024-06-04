# Base image
FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install

# Copy the.env and.env.development files
COPY .env.development .env

# Since this is a development environment, we don't need to build the application
# but we might want to expose the port so that we can access the application through the browser
EXPOSE 3000

# Start the server using the development build
# CMD ["npm", "run", "start:dev"]
CMD ["npm", "run", "start:dev"]
