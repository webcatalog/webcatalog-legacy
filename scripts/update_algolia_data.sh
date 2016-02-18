parse_yaml() {
  local prefix=$2
  local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs=$(echo @|tr @ '\034')
  sed -ne "s|^\($s\)\($w\)$s:$s\"\(.*\)\"$s\$|\1$fs\2$fs\3|p" \
      -e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p"  $1 |
  awk -F$fs '{
    indent = length($1)/2;
    vname[indent] = $2;
    for (i in vname) {if (i > indent) {delete vname[i]}}
    if (length($3) > 0) {
       vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
       printf("%s%s%s=\"%s\"\n", "'$prefix'",vn, $2, $3);
    }
  }'
}

algolia_data="{ \"requests\": ["

for entry in content/app/*
do
  eval $(parse_yaml $entry "config_")

  config_description=$(pandoc $entry -t plain)

  # access yaml content
  echo $config_title
  echo $config_app_url

  algolia_data="$algolia_data { \"action\": \"updateObject\", \"body\": { \"objectID\": \"$config_id\", \"name\": \"$config_title\", \"url\": \"$config_app_url\", \"developer\": \"$config_developer\", \"description\": \"$config_description\" } },"
done

# Remove last comma
algolia_data=${algolia_data%?}

algolia_data="$algolia_data ] }"

echo $algolia_data > .tmp/algolia.json

curl -H "X-Algolia-API-Key: ${ALGOLIA_API_KEY}" \
     -H "X-Algolia-Application-Id: ${ALGOLIA_APPLICATION_ID}" \
     --data-binary @".tmp/algolia.json" \
     --request POST https://${ALGOLIA_APPLICATION_ID}.algolia.net/1/indexes/apps/batch
