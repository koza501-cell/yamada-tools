#!/bin/bash
KEY="79e4093f1b05bc8b935a46a1d65621de30b2cf2820659df7cc6ff2016b4829c4"
HOST="yamada-tools.jp"
KEY_LOCATION="https://yamada-tools.jp/${KEY}.txt"
ENDPOINT="https://www.bing.com/indexnow"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${SCRIPT_DIR}/indexnow.log"

URLS=()
if [ $# -gt 0 ]; then
  for url in "$@"; do URLS+=("$url"); done
else
  while IFS= read -r line; do
    line="$(echo "$line" | tr -d '[:space:]')"
    [ -n "$line" ] && URLS+=("$line")
  done
fi

if [ ${#URLS[@]} -eq 0 ]; then
  echo "ERROR: No URLs provided" >&2
  exit 1
fi

URL_JSON=$(printf '"%s",' "${URLS[@]}")
URL_JSON="${URL_JSON%,}"
PAYLOAD="{\"host\":\"${HOST}\",\"key\":\"${KEY}\",\"keyLocation\":\"${KEY_LOCATION}\",\"urlList\":[${URL_JSON}]}"

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
HTTP_CODE=$(curl -s -o /tmp/indexnow_response.txt -w "%{http_code}" -X POST "${ENDPOINT}" -H "Content-Type: application/json; charset=utf-8" -d "${PAYLOAD}")
RESPONSE=$(cat /tmp/indexnow_response.txt)

echo "[${TIMESTAMP}] Submitted ${#URLS[@]} URLs -> HTTP ${HTTP_CODE} ${RESPONSE}" | tee -a "${LOG_FILE}"

if [ "${HTTP_CODE}" = "200" ] || [ "${HTTP_CODE}" = "202" ]; then
  exit 0
else
  echo "ERROR: IndexNow submission failed (HTTP ${HTTP_CODE})" >&2
  exit 1
fi
