# Makefile for Datifyy Backend Docker Operations

# Variables
IMAGE_NAME = datifyy-backend
IMAGE_TAG = local
CONTAINER_NAME = datifyy-backend
PORT = 5000

# Colors for output
GREEN = \033[0;32m
NC = \033[0m # No Color

.PHONY: help build run stop clean logs shell test

help:
	@echo "Available commands:"
	@echo "  make build    - Build the Docker image"
	@echo "  make run      - Run the container"
	@echo "  make stop     - Stop the container"
	@echo "  make clean    - Remove container and image"
	@echo "  make logs     - View container logs"
	@echo "  make shell    - Open shell in container"
	@echo "  make test     - Run tests in container"
	@echo "  make compose  - Run with docker-compose"

build:
	@echo "$(GREEN)Building Docker image...$(NC)"
	docker build -f Dockerfile.standalone -t $(IMAGE_NAME):$(IMAGE_TAG) .

run:
	@echo "$(GREEN)Starting container...$(NC)"
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):$(PORT) \
		-e NODE_ENV=development \
		-e PORT=$(PORT) \
		$(IMAGE_NAME):$(IMAGE_TAG)
	@echo "$(GREEN)Container started at http://localhost:$(PORT)$(NC)"

stop:
	@echo "$(GREEN)Stopping container...$(NC)"
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

clean: stop
	@echo "$(GREEN)Cleaning up...$(NC)"
	docker rmi $(IMAGE_NAME):$(IMAGE_TAG) || true

logs:
	docker logs -f $(CONTAINER_NAME)

shell:
	docker exec -it $(CONTAINER_NAME) /bin/sh

test:
	docker run --rm $(IMAGE_NAME):$(IMAGE_TAG) yarn test

compose:
	@echo "$(GREEN)Starting services with docker-compose...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)Services started!$(NC)"
	@echo "Backend: http://localhost:5000"
	@echo "PostgreSQL: localhost:5432"
	@echo "Redis: localhost:6379"

compose-down:
	docker-compose down

compose-logs:
	docker-compose logs -f

# Development helpers
dev-build:
	yarn install
	yarn build

dev-test:
	yarn test

# Combined commands
rebuild: clean build run

restart: stop run