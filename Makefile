# Makefile

SHELL := /bin/bash

.PHONY: all production development cleanup

all: menu

menu:
	@echo ""
	@echo "1  -  Start server in production mode (make production)"
	@echo "2  -  Start server in development mode (make development)"
	@echo "3  -  Clean up docker files and debug folder (make cleanup)"
	@echo "0  -  Exit"
	@echo ""

production:
	@chmod +x run
	@./run production

development:
	@chmod +x run
	@./run development

cleanup:
	@chmod +x run
	@./run cleanup
