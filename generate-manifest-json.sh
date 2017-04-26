#!/bin/sh

rm -f manifest.json

cat start_manifest.json >> manifest.json

while read url; do
    if [ -n "$url" ] ; then
        echo "\""$url"\"," >> manifest.json
    fi
done < whitelist_urls.conf

sed -i "$ s/,$//" manifest.json

cat middle_manifest.json >> manifest.json

while read url; do
    if [ -n "$url" ] ; then
    echo "\""$url"\"," >> manifest.json
    fi
done < whitelist_urls.conf


sed -i "$ s/,$//" manifest.json

cat end_manifest.json >> manifest.json
