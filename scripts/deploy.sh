for entry in releases/*
do
  sshpass -p $SOURCEFORGE_PASSWORD rsync -e ssh $entry quanglam2807@frs.sourceforge.net:/home/frs/project/webcatalog-r/$TRAVIS_TAG/
done
