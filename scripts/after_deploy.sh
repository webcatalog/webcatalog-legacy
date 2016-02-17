echo leader=$BUILD_LEADER status=$BUILD_AGGREGATE_STATUS
if [ "$BUILD_LEADER" = "YES" ]; then
  if [ "$BUILD_AGGREGATE_STATUS" = "others_succeeded" ]; then
    $(npm bin)/surge --project ./public --domain webcatalog.xyz
  fi
fi
