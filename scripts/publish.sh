#!/usr/bin/env bash

set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD)

git clean -fd
yarn version
git push origin ${BRANCH}
git push origin --tags
