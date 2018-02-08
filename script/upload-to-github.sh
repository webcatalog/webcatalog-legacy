cd dist
git init
git checkout --orphan icons
git add .
git commit -m "Init"
git remote add origin https://$GH_TOKEN@github.com/quanglam2807/webcatalog-apps.git
git push origin icons
