# ---------- Builder Stage ----------
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies based on package-lock/package.json
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# ---------- Production Stage ----------
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: overwrite default nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
