#!/bin/bash

git checkout master &&
git merge dev &&
npm version $1 &&
git push origin master