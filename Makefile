all: install docs

install:
	npm install

docs:
	./node_modules/.bin/docco -l linear chip-8.coffee

.PHONY: all docs install
