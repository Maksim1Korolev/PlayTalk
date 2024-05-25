# Base image
FROM node:16-alpine

# Create and set app directory
WORKDIR /usr/src/app

# ENV DATABASE_URL=mongodb+srv://kimikirimusu:43214321m@cluster0.krix0wf.mongodb.net/TalkBackDB?retryWrites=true&w=majority&appName=Cluster0
# ENV PORT=3011

# Install app dependencies by copying package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the application's port
EXPOSE 3011

# Command to run the application
CMD ["npm", "run", "dev"]
