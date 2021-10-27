set COMPOSE_CONVERT_WINDOWS_PATHS=1
docker-compose -p components up -d --build
pause
docker-compose -p components down