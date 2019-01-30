# bikeindustryjobs
Show bike industry jobs all in one easy to browse website

Mongo, React, Express, Node

Currently running http://careers.bike/

### to run:

```
docker-compose up -d
```

node will be running on port 9004
frontend will be running on port 8000

### nginx config on ubuntu:

```
server {
        listen 80;
        listen [::]:80;

        server_name careers.bike;

        

        gzip            on;
        gzip_min_length 1000;
        gzip_proxied    expired no-cache no-store private auth;
        gzip_types      text/plain application/xml application/json;


        location /api {
          proxy_pass http://localhost:9004;
        }
        
        location / {
          proxy_pass http://localhost:8000;
        }        
}
```
