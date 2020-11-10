#!/bin/bash
for x in $*; do
head -$COPYRIGHTLEN $x | diff copyright.txt - || ( ( cat copyright.txt; echo; cat $x) > /tmp/file;
mv /tmp/file $x )
done