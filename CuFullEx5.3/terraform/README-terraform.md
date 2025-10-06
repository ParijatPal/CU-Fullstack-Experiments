Terraform overview and usage notes.

This Terraform configuration is a template intended to:
- Create two ECR repositories (frontend & backend)
- Create an ECS cluster and Fargate services for the frontend and backend
- Create an Application Load Balancer with listeners and target groups
- Create IAM roles required for ECS tasks and execution

IMPORTANT:
- The terraform files are opinionated and simplified for demonstration. They will create resources that may incur AWS charges.
- You need to supply proper values for variables in `terraform/terraform.tfvars` or via environment variables.
- For production use, tighten IAM policies, enable health checks, and configure logging & autoscaling.

Basic terraform workflow (inside terraform/):
```bash
terraform init
terraform plan -out plan
terraform apply "plan"
# To destroy:
terraform destroy
```
