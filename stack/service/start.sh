docker network create net
docker-compose --project-name service -f ./eventstore/docker-compose.yml -f ./logging/docker-compose.yml up -d

column -t -s '|' urls.table