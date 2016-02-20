sshpass -p $SOURCEFORGE_PASSWORD rsync --ignore-existing -avP -e ssh releases/* quanglam2807@frs.sourceforge.net:/home/frs/project/webcatalog-r/$BUILD_VERSION/
