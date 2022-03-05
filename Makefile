.PHONY: build deploy

build:
	yarn build

deploy: build
	firebase deploy
