# Based on https://gist.github.com/oubiwann/453744744da1141ccc542ff75b47e0cf
#!/usr/bin/env bash

# generate_alt_exec.sh "path/to/fake" "path/to/real"
FAKE_PATH=${1}
REAL_PATH=${2}

cd "${0%/*}"

# Move real exec to new path
mv "${FAKE_PATH}" "${REAL_PATH}"

# Create fake exec
cp "WebCatalog_Alt.sh" "${FAKE_PATH}"

chmod +x "${FAKE_PATH}"

echo "${FAKE_PATH}"
