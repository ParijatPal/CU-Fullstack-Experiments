# Deploy Full Stack App on AWS with Load Balancing (ECS Fargate + ALB)

This project contains a small full-stack app (React + Express) and infrastructure-as-code templates
(Terraform) to deploy both services to **AWS ECS Fargate** behind an **Application Load Balancer (ALB)**.
A GitHub Actions workflow is included to build Docker images, push to ECR, and apply Terraform.

## What is included
- `frontend/` — Vite + React app served by nginx, Dockerfile included
- `backend/` — Node + Express API, Dockerfile included
- `terraform/` — Terraform templates to create VPC (optional), ECS cluster, ECR repos, ALB, services
- `.github/workflows/ci-cd.yml` — Builds images, pushes to ECR, and runs Terraform
- `scripts/` — helper scripts for local testing and convenience

## Important notes (read this before running anything)
1. **This repo contains templates**. Infrastructure provisioning on AWS costs money. Inspect Terraform files and understand the resources created before applying.
2. The GitHub Actions workflow automates image builds and terraform apply. **Do not enable that workflow** on a repo you aren't ready to bill — or remove the `apply` step until you review it.
3. Terraform will create resources in your AWS account. Destroy them when done with `terraform destroy` to avoid charges.
4. You must create AWS credentials and GitHub secrets as described below.

## Quick local test (without AWS)
### Backend
```bash
cd backend
npm ci
npm start
# API: http://localhost:4000/api/hello
```
### Frontend
```bash
cd frontend
npm ci
npm run build
# Serve `frontend/dist` with a static server or run the provided docker flow
```

## Terraform & AWS workflow (high level)
1. Create an AWS IAM user (programmatic access) with permissions to manage ECS, ECR, ALB, VPC, IAM, and CloudWatch (administrator policies for testing; tighten for production).
2. Create a GitHub repo and push this project.
3. In GitHub repo secrets add:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` (e.g., us-east-1)
   - `ECR_REPO_PREFIX` (optional; default set in workflow)
4. The provided GitHub Actions workflow will:
   - Build frontend and backend images
   - Log in to ECR and push images
   - Run `terraform init`, `terraform apply -auto-approve` to create infra and deploy services
5. The ALB DNS will be output by Terraform. Access it in browser to reach the frontend; frontend calls the backend via internal ALB path.

## Files and where to start
- `terraform/README-terraform.md` — important Terraform usage notes and variables
- `.github/workflows/ci-cd.yml` — CI/CD pipeline
- `frontend/` and `backend/` — app code & Dockerfiles

## Clean up
- To remove AWS resources: run `terraform destroy` in `terraform/` (or remove from the console).
- Remove pushed ECR images from Docker Hub/ECR if desired.

## Support / Next steps
If you want, I can:
- Add an RDS database for backend persistence and show environment injection securely.
- Add blue-green or canary deployment steps.
- Harden IAM policies and least privilege for production.

⚠️ Again: **Running Terraform will create billable AWS resources.** Proceed cautiously.
