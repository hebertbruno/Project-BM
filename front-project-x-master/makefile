.PHONY: login bootstrap install shell build run stop deploy logs clean images-clean containers-clean docker-clean

VERSION ?= latest
CONTAINER_NAME = frontprojectx_front_1
APP_NAME = buy-messenger-staging

login:
	heroku login
	heroku container:login

bootstrap:
	git submodule init
	git submodule update
	make build
	make install

install:
	docker-compose run --rm front yarn

shell:
	docker exec -it $(CONTAINER_NAME) sh

build:
	docker-compose build

run:
	docker-compose up -d

stop:
	docker-compose down

deploy:
	@echo 'building production image'
	$(eval ID=$(shell docker build -q -t $(APP_NAME):$(VERSION) .))
	@echo 'deploying'
	docker tag $(ID) registry.heroku.com/$(APP_NAME)/web:$(VERSION)
	docker push registry.heroku.com/$(APP_NAME)/web:$(VERSION)

logs:
	docker logs -f $(COTAINER_NAME) | ./node_modules/.bin/bunyan

clean:
	rm -r app/build *.log out node_modules

images-clean:
	docker rmi $$(docker images | grep "^<none>" | awk '{print $3}')

containers-clean:
	docker rm $$(docker ps -a -f status=exited -f status=created -q)
