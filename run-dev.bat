@echo off
setlocal
cd /d "%~dp0"

docker --version >nul 2>&1
if errorlevel 1 (
  echo Docker is not installed or not available in PATH.
  pause
  exit /b 1
)

docker compose version >nul 2>&1
if errorlevel 1 (
  echo Docker Compose plugin is not available.
  pause
  exit /b 1
)

echo Starting SASA Forge dev stack...
docker compose -f infra\docker-compose.dev.yml up --build
set EXIT_CODE=%ERRORLEVEL%

echo.
if not "%EXIT_CODE%"=="0" (
  echo Dev stack exited with code %EXIT_CODE%.
) else (
  echo Dev stack stopped.
)
pause
exit /b %EXIT_CODE%
