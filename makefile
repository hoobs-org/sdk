sdk: lint paths
	node_modules/.bin/tsc
	node_modules/.bin/webpack --mode=production
	npm pack
	mv hoobs-sdk-$(shell project version).tgz builds/
	rm -fR lib
	rm -fR dist
	rm -f *.tgz

lint:
	node_modules/.bin/eslint 'src/**/*.ts'

paths:
	mkdir -p builds
	mkdir -p dist
	mkdir -p lib

publish: lint paths
	npm adduser
	node_modules/.bin/tsc
	node_modules/.bin/webpack --mode=production
	npm publish --access public

clean:
	rm -fR lib
	rm -fR dist
	rm -f *.tgz
