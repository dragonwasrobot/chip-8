#!/bin/sh

set -e

js="docs/elm.js"
min="docs/elm.min.js"

elm make --optimize --output=$js src/Main.elm

./node_modules/.bin/uglifyjs $js --compress 'pure_funcs=[F2,F3,F4,F5,F6,F7,F8,F9,A2,A3,A4,A5,A6,A7,A8,A9],pure_getters,keep_fargs=false,unsafe_comps,unsafe' | ./node_modules/.bin/uglifyjs --mangle --output $min

echo "Build size:    $(cat $js | wc -c) bytes  ($js)"
echo "Minified size: $(cat $min | wc -c) bytes  ($min)"
rm $js
