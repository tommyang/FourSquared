#!/usr/bin/env bash
set -e

### Configuration ###

APP_DIR=/home/foursquared/FourSquared
RESTART_ARGS=foursquared

### Automation steps ###

set -x

# Pull latest code
cd $APP_DIR
git reset --hard HEAD
git pull

# Install dependencies
yarn install --production

# Restart app
pm2 gracefulReload $RESTART_ARGS