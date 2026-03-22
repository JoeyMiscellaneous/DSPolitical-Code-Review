#!/bin/bash

docker compose build

docker compose run dev-php composer install
docker compose run dev-react npm install

docker compose up -d --remove-orphans

echo "Navigate to http://localhost:5173"
