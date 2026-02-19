@echo off
setlocal
cd /d "%~dp0"

echo Rebuilding dev images without cache...
docker compose -f infra\docker-compose.dev.yml build --no-cache
if errorlevel 1 (
  echo Dev rebuild failed.
  pause
  exit /b 1
)

echo Rebuilding prod-like images without cache...
docker compose -f infra\docker-compose.prod.yml build --no-cache
if errorlevel 1 (
  echo Prod rebuild failed.
  pause
  exit /b 1
)

echo Rebuild complete.
pause
exit /b 0
