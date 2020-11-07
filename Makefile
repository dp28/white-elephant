.PHONY: install clean test start build deploy

ENVIRONMENT ?= local

install: node_modules

clean:
	rm -rf node_modules build

test: node_modules
	REACT_APP_ENVIRONMENT=test yarn test

start: node_modules
	REACT_APP_ENVIRONMENT=$(ENVIRONMENT) HTTPS=true yarn start

start_dev_server: node_modules
	REACT_APP_ENVIRONMENT=local npx peerjs --port 9000

build: node_modules
	REACT_APP_ENVIRONMENT=$(ENVIRONMENT) yarn build

deploy: build
	aws s3 sync build/ s3://white-elephant.djpdev.com --acl public-read

node_modules: package.json
	yarn install
	touch node_modules
