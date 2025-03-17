#!/bin/sh

set -e

rm -rf dist

pnpm build

cd dist

zip -r ostore.zip *