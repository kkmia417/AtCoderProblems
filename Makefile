.DEFAULT_GOAL := help

.PHONY: help
help: ## Show available commands
	@awk -F ':|##' '/^[^\t].+?:.*?##/ { printf "\033[36m%-24s\033[0m %s\n", $$1, $$NF }' $(MAKEFILE_LIST)

.PHONY: up
up: ## Start all services in foreground
	docker compose up

.PHONY: up/d
up/d: ## Start all services in background
	docker compose up -d

.PHONY: down
down: ## Stop all services
	docker compose down

.PHONY: restart
restart: ## Restart all services in background
	docker compose down
	docker compose up -d

.PHONY: ps
ps: ## Show service status
	docker compose ps

.PHONY: logs
logs: ## Follow logs of all services
	docker compose logs -f --tail=100

.PHONY: logs/backend
logs/backend: ## Follow backend logs
	docker compose logs -f --tail=100 backend-development

.PHONY: logs/frontend
logs/frontend: ## Follow frontend logs
	docker compose logs -f --tail=100 frontend-development

.PHONY: sh/backend
sh/backend: ## Open shell in backend container
	docker compose exec backend-development sh

.PHONY: sh/frontend
sh/frontend: ## Open shell in frontend container
	docker compose exec frontend-development sh

.PHONY: build/backend
build/backend: ## Build backend
	docker compose exec backend-development cargo build

.PHONY: fmt/backend
fmt/backend: ## Format backend code
	docker compose exec backend-development cargo fmt --all

.PHONY: test/backend
test/backend: ## Run backend tests
	docker compose exec backend-development cargo test --workspace --no-fail-fast -- --test-threads=1

.PHONY: check/backend
check/backend: ## Run backend format check and tests
	docker compose exec backend-development cargo fmt --all -- --check
	docker compose exec backend-development cargo test --workspace -- --test-threads=1

.PHONY: build/frontend
build/frontend: ## Build frontend
	docker compose exec frontend-development yarn build

.PHONY: lint/frontend
lint/frontend: ## Lint frontend
	docker compose exec frontend-development yarn lint

.PHONY: format/frontend
format/frontend: ## Format frontend files
	docker compose exec frontend-development yarn format

.PHONY: test/frontend
test/frontend: ## Run frontend unit tests once
	docker compose exec -e CI=true frontend-development yarn test --watchAll=false

.PHONY: ci/local
ci/local: ## Run common local checks
	$(MAKE) check/backend
	$(MAKE) lint/frontend
	$(MAKE) test/frontend
