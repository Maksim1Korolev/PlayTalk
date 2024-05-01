# Base image
FROM node:16-alpine

# Create and set app directory
WORKDIR /usr/src/app

# ENV VITE_NODE_ENV=development
# ENV VITE_AUTH_SERVER_URL=http://localhost:5000/api/auth
# ENV VITE_USERS_SERVER_URL=http://localhost:5000/api/users
# ENV VITE_ONLINE_SOCKET_URL=http://localhost:4000

# Install app dependencies by copying package.json and package-lock.json
COPY package*.json ./


# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the application's port
EXPOSE 5173

# Command to run the application
CMD ["npm", "run", "dev"]
