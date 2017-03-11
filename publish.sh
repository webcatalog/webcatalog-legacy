#!/bin/bash

cd www
git init
git checkout -b compiled
git add .
git -c user.name='Quang Lam' -c user.email='quang.lam2807@gmail.com' commit -m "${TRAVIS_JOB_NUMBER}"
git remote add origin "https://$GH_TOKEN@github.com/webcatalog/backend.git"
git push origin compiled -f
