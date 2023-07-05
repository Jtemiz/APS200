#!/bin/bash

mv /aps200/certs/aps200.key /etc/nginx/ssl/private/aps200.key

mv /aps200/certs/aps200.ctr /etc/nginx/ssl/certs/aps200.crt

mv /aps200/certs/aps200-cert.conf /etc/nginx/snippets/aps200-cert.conf

mv /aps200/certs/ssl-params.conf /etc/nginx/snippets/ssl-params.conf

rm /etc/nginx/sites-available/aps200.conf

mv /aps200/certs/aps200.conf /etc/nginx/sites-available/aps200.conf

nginx -t

systemctl restart nginx
