#!/usr/bin/env bash

set -e

function red() {
    echo -en "\x1b[31m$*\x1b[0m"
}

function green() {
    echo -en "\x1b[32m$*\x1b[0m"
}

BRANCH=$(git rev-parse --abbrev-ref HEAD)
OLD_VERSION=$(node -e "console.log(require('./package.json').version)")

git clean -fd
yarn version $*

NEW_VERSION=$(node -e "console.log(require('./package.json').version)")

if [[ "${NEW_VERSION}" == "${OLD_VERSION}" ]]; then
    echo "No version changed, bye"
    exit 0
fi

echo "Version updated to from $(red ${OLD_VERSION}) to $(green ${NEW_VERSION})"
echo -n "Continue to push to \"${BRANCH}\" branch? [y/n]: "
read FLAG
if [[ "${FLAG}" != "y" ]]; then
    echo "Push aborted, rollback to the previous version"
    git reset --hard HEAD^
    git tag --delete "v${NEW_VERSION}"
    exit 1
fi

echo "Pushing to \"${BRANCH}\" branch"
git push origin ${BRANCH}
git push origin --tags
