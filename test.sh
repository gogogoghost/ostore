#!/bin/sh

set -e

npm run build

~/software/appscmd-x86_64-unknown-linux-gnu --socket /tmp/apps_service_uds.sock install ./dist

