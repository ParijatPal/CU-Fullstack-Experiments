# React (Vite) App — Dockerized with Multi-Stage Build

What you get:
- A minimal React app created with Vite
- A multi-stage Dockerfile that builds the app using Node and serves it with nginx
- nginx config that supports SPA routing
- .dockerignore
- Instructions to build and run the Docker image

## Quick commands

Build the Docker image (from project root):
```
docker build -t react-vite-nginx:latest .
```

Run it:
```
docker run -p 8080:80 react-vite-nginx:latest
```

Then open http://localhost:8080

## Notes
- This project does not include node_modules. On `docker build`, the builder stage will install dependencies and create the production build.
- The Dockerfile uses a multi-stage approach:
  1. `node:18-alpine` to install deps and generate the production build
  2. `nginx:stable-alpine` to serve the static files

Enjoy — tweak the app under `src/` and rebuild the image.
