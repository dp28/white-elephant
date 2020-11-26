.PHONY: install clean test start build deploy start_dev_server deploy_server setup_environment

export ENVIRONMENT ?= local

install: node_modules

clean:
	rm -rf node_modules build

test: node_modules
	yarn test

start: node_modules setup_environment
	HTTPS=true yarn start

start_dev_server: node_modules
	cd server && npx peerjs --port 9000 --key white-elephant

build: node_modules setup_environment
	yarn build

deploy: build
	aws s3 sync build/ s3://white-elephant.djpdev.com --acl public-read

deploy_server:
	git subtree push --prefix server/ heroku master

node_modules: package.json
	yarn install
	touch node_modules

setup_environment:
	./bin/validate_environment
