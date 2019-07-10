#!/bin/bash

npm install -g harp
yarn
harp compile
cd www
git init
git checkout -b gh-pages
git add .
git -c user.name='Quang Lam' -c user.email='quang.lam2807@gmail.com' commit -m init
git remote add origin "https://$GH_TOKEN@github.com/secreton/secretonapp.com.git"
git push origin gh-pages -f --quiet > /dev/null 2>&1
