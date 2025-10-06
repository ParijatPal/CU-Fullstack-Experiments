# React (Vite) App — CI/CD with GitHub Actions

This project demonstrates a **CI/CD pipeline** for a Dockerized React (Vite) app using GitHub Actions.

## Workflow Overview
- **Build Stage**: Installs dependencies and builds the production bundle.
- **Docker Build & Push**: Builds a Docker image and pushes it to Docker Hub.
- **Deploy Stage** (optional): Deploy to your server or any hosting via SSH or another step.

## GitHub Setup
1. Create a repository on GitHub.
2. Add the following **secrets** in your GitHub repo settings → Secrets → Actions:
   - `DOCKER_USERNAME` – Your Docker Hub username
   - `DOCKER_PASSWORD` – Your Docker Hub access token/password
3. Push this code to your GitHub repository.
4. The workflow will automatically run on every push to `main`.

## Local Commands
```bash
docker build -t react-vite-cicd .
docker run -p 8080:80 react-vite-cicd
```

Then open http://localhost:8080

## Tech Stack
- React (Vite)
- Node.js 18 (for build)
- Nginx (for serving static files)
- GitHub Actions for CI/CD
