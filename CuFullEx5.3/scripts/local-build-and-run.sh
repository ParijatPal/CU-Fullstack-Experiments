#!/usr/bin/env bash
# Build backend and frontend images locally and run them with docker-compose (simple local test)
docker build -t fs-backend ./backend
docker build -t fs-frontend ./frontend
echo "Built fs-backend and fs-frontend. Run with your preferred method."
