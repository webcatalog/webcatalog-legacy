#!/bin/bash
for x in $*; do
head -$COPYRIGHTLEN $x | diff copyright.txt - || ( ( cat copyright.txt; echo; cat $x) > /tmp/file;
mv /tmp/file $x )
done

# https://blog.greenroots.info/add-copyright-or-license-text-to-the-source-files-recursively-ck93zodue042h7us1nur56u4f
# find <SOURCE_CODE_DIRECTIRY> -type d -name "<EXCLUDE_DIRECTORY>" -prune -o -name "*.js" -print0 | xargs -0 ./addcopyright.sh