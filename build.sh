#!/usr/bin/env bash

set -ef -o pipefail

echo "Building..."

# Install node dependencies
pnpm install --frozen-lockfile

# Set flags in index.html
OS="$(uname)"
case $OS in
    Linux)
        sed -i 's/basePath: ""/basePath: "\/chip-8\/roms\/"/g' docs/index.html
        ;;

    Darwin)
        sed -i '' 's/basePath: ""/basePath: "\/roms\/"/g' docs/index.html
        ;;

    *)
        echo "Unsupported OS"
        exit 1
        ;;
esac

# Build Elm
js="docs/elm.js"
elm make --optimize --output=$js src/Main.elm

# Minimize compiled JS
min="docs/elm.min.js"
./node_modules/.bin/uglifyjs $js --compress 'pure_funcs=[F2,F3,F4,F5,F6,F7,F8,F9,A2,A3,A4,A5,A6,A7,A8,A9],pure_getters,keep_fargs=false,unsafe_comps,unsafe' | ./node_modules/.bin/uglifyjs --mangle --output $min

echo "Finished building."
echo "Build size:    $(cat $js | wc -c) bytes  ($js)"
echo "Minified size: $(cat $min | wc -c) bytes  ($min)"

rm $js
