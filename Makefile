dev:
	docker-compose -f docker-compose.dev.yaml watch

up:
	docker-compose up
down:
	docker-compose down

clean:
	docker compose down --rmi all

push-pipeline:
	docker-compose -f docker-compose.pipeline.yaml build
	docker-compose -f docker-compose.pipeline.yaml push
