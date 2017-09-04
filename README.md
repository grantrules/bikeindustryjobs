# bikeindustryjobs
Show bike industry jobs all in one easy to browse website

Mongo, React, Express, Node

Currently running http://careers.bike/

### to run:

```
npm install
node scraper.js
node server.js &
cd app
npm install
npm run build
```

node will be running on port 9004
frontend will be in app/build

### nginx config on ubuntu:

```
proxy_cache_path  /data/nginx/cache  levels=1:2    keys_zone=STATIC:10m inactive=24h  max_size=1g;
server {
        listen 80;
        listen [::]:80;

        server_name careers.bike;

        root /home/grant/careers.bike/bikeindustryjobs/app/build;
        index index.html;

        gzip            on;
        gzip_min_length 1000;
        gzip_proxied    expired no-cache no-store private auth;
        gzip_types      text/plain application/xml application/json;


        location /api {
          proxy_pass http://localhost:9004;
          proxy_cache            STATIC;
          proxy_cache_valid      200  1h;
          proxy_cache_use_stale  error timeout invalid_header updating
                                   http_500 http_502 http_503 http_504;
        }
}
```
