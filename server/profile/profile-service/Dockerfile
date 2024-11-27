# Base image
FROM node:16-alpine

ARG ACCESS_KEY_ID
ARG SECRET_ACCESS_KEY

ENV AWS_ACCESS_KEY_ID=${ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${SECRET_ACCESS_KEY}
ENV AWS_S3_BUCKET_NAME=testforavatars
ENV AWS_REGION=eu-north-1

# Create and set app directory
WORKDIR /usr/src/app

# Install app dependencies by copying package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the application's port
EXPOSE 3040

# Command to run the application
CMD ["npm", "run", "dev"]
