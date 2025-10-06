# --- This is a simplified template. Review & edit for your needs. ---
locals {
  project = var.project_name
}

# ECR repos
resource "aws_ecr_repository" "frontend" {
  name = "${local.project}-frontend"

  image_tag_mutability = "MUTABLE"
}
resource "aws_ecr_repository" "backend" {
  name = "${local.project}-backend"

  image_tag_mutability = "MUTABLE"
}

# IAM role for task execution
resource "aws_iam_role" "ecs_task_execution" {
  name = "${local.project}-ecs-task-exec-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}
data "aws_iam_policy_document" "ecs_task_assume_role" {
  statement {
    effect = "Allow"
    principals { type = "Service"; identifiers = ["ecs-tasks.amazonaws.com"] }
    actions = ["sts:AssumeRole"]
  }
}
resource "aws_iam_role_policy_attachment" "ecs_task_exec_policy" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# VPC (use default if present) - here we create a simple VPC for demonstration
resource "aws_vpc" "this" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "${local.project}-vpc" }
}
resource "aws_subnet" "pub" {
  count = 2
  cidr_block = cidrsubnet(aws_vpc.this.cidr_block, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  tags = { Name = "${local.project}-subnet-${count.index}" }
}
data "aws_availability_zones" "available" {}


# Internet Gateway & Route Table
resource "aws_internet_gateway" "igw" { vpc_id = aws_vpc.this.id }
resource "aws_route_table" "rt" {
  vpc_id = aws_vpc.this.id
  route { cidr_block = "0.0.0.0/0"; gateway_id = aws_internet_gateway.igw.id }
}
resource "aws_route_table_association" "rta" {
  count = length(aws_subnet.pub)
  subnet_id = aws_subnet.pub[count.index].id
  route_table_id = aws_route_table.rt.id
}

# Security Group for ALB and services
resource "aws_security_group" "alb_sg" {
  name   = "${local.project}-alb-sg"
  vpc_id = aws_vpc.this.id
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress { from_port = 0; to_port = 0; protocol = "-1"; cidr_blocks = ["0.0.0.0/0"] }
}

# Create ECS cluster
resource "aws_ecs_cluster" "cluster" {
  name = "${local.project}-cluster"
}

# ALB
resource "aws_lb" "alb" {
  name               = "${local.project}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = aws_subnet.pub[*].id
}
resource "aws_lb_target_group" "frontend_tg" {
  name     = "${local.project}-frontend-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.this.id
  health_check { path = "/index.html"; interval = 30; timeout = 5; healthy_threshold = 2 }
}
resource "aws_lb_target_group" "backend_tg" {
  name     = "${local.project}-backend-tg"
  port     = 4000
  protocol = "HTTP"
  vpc_id   = aws_vpc.this.id
  health_check { path = "/api/hello"; interval = 30; timeout = 5; healthy_threshold = 2 }
}
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"
  default_action { type = "forward"; target_group_arn = aws_lb_target_group.frontend_tg.arn }
}

# ECR retrieval (we'll push images externally via pipeline)
data "aws_ecr_repository" "frontend" { name = aws_ecr_repository.frontend.name }
data "aws_ecr_repository" "backend" { name = aws_ecr_repository.backend.name }

# Task definitions for frontend and backend (Fargate)
resource "aws_ecs_task_definition" "frontend" {
  family                   = "${local.project}-frontend"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  container_definitions    = jsonencode([{
    name = "frontend"
    image = var.frontend_image
    essential = true
    portMappings = [{ containerPort = 80; protocol = "tcp" }]
  }])
}
resource "aws_ecs_task_definition" "backend" {
  family                   = "${local.project}-backend"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  container_definitions    = jsonencode([{
    name = "backend"
    image = var.backend_image
    essential = true
    portMappings = [{ containerPort = 4000; protocol = "tcp" }]
  }])
}

# ECS services
resource "aws_ecs_service" "frontend_svc" {
  name            = "${local.project}-frontend-svc"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  network_configuration {
    subnets = aws_subnet.pub[*].id
    security_groups = [aws_security_group.alb_sg.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.frontend_tg.arn
    container_name   = "frontend"
    container_port   = 80
  }
}

resource "aws_ecs_service" "backend_svc" {
  name            = "${local.project}-backend-svc"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  network_configuration {
    subnets = aws_subnet.pub[*].id
    security_groups = [aws_security_group.alb_sg.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.backend_tg.arn
    container_name   = "backend"
    container_port   = 4000
  }
}

# Outputs
output "alb_dns" { value = aws_lb.alb.dns_name }
output "frontend_ecr" { value = aws_ecr_repository.frontend.repository_url }
output "backend_ecr" { value = aws_ecr_repository.backend.repository_url }
