variable "region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "fullstack-ecs"
}

variable "frontend_image" {
  type = string
  description = "ECR image URI for frontend (including tag)"
}

variable "backend_image" {
  type = string
  description = "ECR image URI for backend (including tag)"
}
