#/usr/bin/env bash

changed_files="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"

check_run() {
  echo "$changed_files" | grep -E --quiet "$1" && eval "$2"
}

if [[ "$USER" != "foursquared" ]]; then
    check_run package.json "cd $(git rev-parse --show-toplevel) && yarn"
fi