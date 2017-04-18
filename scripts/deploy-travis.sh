#!/usr/bin/env bash
set -e

### Configuration ###

SERVER=foursquared@35.185.221.32
APP_DIR=/home/foursquared/FourSquared
KEYFILE=/tmp/deploy_id_rsa
REMOTE_SCRIPT_PATH=/home/foursquared/FourSquared/server.sh

### Library ###

function run()
{
  echo "Running: $@"
  "$@"
}

### Automation steps ###

if [[ "$KEYFILE" != "" ]]; then
  KEYARG="-i $KEYFILE"
else
  KEYARG=
fi

echo "---- Running deployment script on remote server ----"
run ssh $KEYARG $SERVER bash $REMOTE_SCRIPT_PATH