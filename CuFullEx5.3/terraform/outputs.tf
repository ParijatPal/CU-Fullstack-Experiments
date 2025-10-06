output "alb_dns" {
  description = "ALB DNS name to access the frontend"
  value       = aws_lb.alb.dns_name
}
output "frontend_ecr" { value = aws_ecr_repository.frontend.repository_url }
output "backend_ecr" { value = aws_ecr_repository.backend.repository_url }
