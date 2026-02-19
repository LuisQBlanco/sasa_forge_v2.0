@echo off
setlocal
cd /d "%~dp0"

echo Streaming dev logs...
docker compose -f infra\docker-compose.dev.yml logs -f --tail=200
set EXIT_CODE=%ERRORLEVEL%

pause
exit /b %EXIT_CODE%
