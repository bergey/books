build:
	yarn build

deploy: build
	firebase deploy
