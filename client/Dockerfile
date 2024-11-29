# Base image for building the application
FROM node:16-alpine as builder

WORKDIR /usr/src/app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Development Stage
FROM node:16-alpine as development

WORKDIR /usr/src/app

# Copy dependencies and source code for live development
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "run", "dev"] 

# Production Stage
FROM nginx:alpine as production

# Copy static build files to Nginx
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
