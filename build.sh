#!/bin/sh

set -e

pnpm build

cd dist

zip -r ostore.zip *