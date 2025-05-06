#!/bin/sh
set -e

echo "Build the Image"
docker build -t order-service:v1 .

echo "Run the container"
docker run -d  -p 4003:4003 order-service:v1 --name order-service


