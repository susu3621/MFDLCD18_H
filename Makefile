PXT ?= npx pxt

.PHONY: all build deploy test

all: build

build:
	$(PXT) build

deploy:
	$(PXT) deploy

test:
	$(PXT) test
