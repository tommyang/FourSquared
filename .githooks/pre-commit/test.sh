#!/usr/bin/env bash
red="\033[0;31m"
yellow="\033[1;33m"
green="\033[1;32m"
reset="\033[0m"

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "master" ]]; then
    exit 0
fi

STASH_NAME="pre-commit-$(date +%s)"
git stash save -q --keep-index $STASH_NAME

cd "$(git rev-parse --show-toplevel)"
yarn test -- --reporter min

testResults=$?

STASHES=$(git stash list)
if [[ $STASHES == "$STASH_NAME" ]]; then
  git stash pop -q
fi

if [ $testResults -ne 0 ]
then
    echo -e "${red}\n Tests FAILED\n\n commit ABORTED${reset}"
    exit 1
else
    echo -e "${green}\nOK\n${reset}"
fi
exit 0