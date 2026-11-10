# Stage 1: Build the Angular application
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install exactly what the lockfile pins
RUN npm ci

# Copy source code
COPY . .

# Build the Angular application for production
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy custom nginx config (optional - for SPA routing support)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist/Angular/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
