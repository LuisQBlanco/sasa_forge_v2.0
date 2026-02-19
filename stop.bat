@echo off
setlocal
cd /d "%~dp0"

echo Stopping dev stack...
docker compose -f infra\docker-compose.dev.yml down

echo Stopping prod-like stack...
docker compose -f infra\docker-compose.prod.yml down

echo Done.
pause
exit /b 0
