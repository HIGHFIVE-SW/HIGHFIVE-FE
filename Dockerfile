# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Set environment variables for build
ENV REACT_APP_API_BASE_URL=http://trendist.site
ENV REACT_APP_FALLBACK_API_URL=http://trendist.site

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 