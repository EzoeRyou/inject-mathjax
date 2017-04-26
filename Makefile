
manifest.json : whitelist_urls.conf
	./generate-manifest-json.sh

clean :
	rm -f manifest.json

.PHONY :	clean
