# Base image
FROM node:16-alpine

# Create and set app directory
WORKDIR /usr/src/app

# ENV PORT=4200

# Install app dependencies by copying package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the application's port
EXPOSE 4200

# Command to run the application
CMD ["npm", "run", "dev"]
