# Base Stage
FROM node:16-alpine AS base

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . ./

# Development Stage
FROM base AS development
CMD ["npm", "run", "dev"]

# Build Stage
FROM base AS build
RUN npm run build

# Production Stage
FROM nginx:alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static build files to Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
